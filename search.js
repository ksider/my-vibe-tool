const axios = require('axios');
const cheerio = require('cheerio');

const COUNTRY_ALIASES = {
    uk: 'uk',
    unitedkingdom: 'uk',
    'united-kingdom': 'uk',
    england: 'uk',
    wales: 'uk',
    scotland: 'uk',
    'northern-ireland': 'uk',
    greatbritain: 'uk',
    britain: 'uk',
    netherlands: 'netherlands',
    holland: 'netherlands',
    nl: 'netherlands'
};

// Страница, где всегда лежит актуальный список спонсоров для UK
const INFO_PAGE_URL = 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers';
const NETHERLANDS_PAGE_URL = 'https://ind.nl/en/public-register-recognised-sponsors/public-register-work';

function normalizeCountryToken(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z]/g, '');
}

function parseSearchRequest(args) {
    const safeArgs = (args || []).filter(value => value !== undefined && value !== null && String(value).trim() !== '');
    const filteredArgs = [];
    const countryFlagIndex = new Set();
    let country = 'uk';

    for (let i = 0; i < safeArgs.length; i++) {
        const arg = safeArgs[i];
        const normalizedArg = normalizeCountryToken(arg);

        if (arg === '--country' || arg === '-c') {
            countryFlagIndex.add(i);
            if (i + 1 < safeArgs.length) {
                countryFlagIndex.add(i + 1);
                const nextCountry = normalizeCountryToken(safeArgs[i + 1]);
                if (COUNTRY_ALIASES[nextCountry]) {
                    country = COUNTRY_ALIASES[nextCountry];
                }
            }
            continue;
        }

        if (COUNTRY_ALIASES[normalizedArg]) {
            country = COUNTRY_ALIASES[normalizedArg];
            countryFlagIndex.add(i);
            continue;
        }

        filteredArgs.push(arg);
    }

    const query = filteredArgs.join(' ').trim();
    return { country, query };
}

// Функция для поиска ссылки на самый свежий CSV-файл
async function getLatestCsvUrl() {
    try {
        const { data } = await axios.get(INFO_PAGE_URL, { timeout: 15000 });
        const $ = cheerio.load(data);

        let csvUrl = null;

        // Ищем все ссылки на странице и отбираем ту, что ведет на .csv
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.endsWith('.csv')) {
                csvUrl = href;
                return false; // Прерываем цикл, так как ссылка найдена
            }
        });

        return csvUrl;
    } catch (error) {
        console.error('Ошибка при запросе к странице GOV.UK:', error.message);
        return null;
    }
}

// Функция для извлечения даты из имени файла
function extractDateFromFilename(csvUrl) {
    const filename = csvUrl.split('/').pop();
    const dateMatch = filename.match(/(\d{1,2}[.-]?\d{1,2}[.-]?\d{4}|\d{4}[.-]?\d{1,2}[.-]?\d{1,2})/);
    return dateMatch ? dateMatch[0] : null;
}

function extractNetherlandsUpdatedDate(data) {
    const isoMatch = data.match(/\b\d{4}-\d{2}-\d{2}\b/);
    if (isoMatch) return isoMatch[0];

    const textMatch = data.match(/\b\d{1,2}\s+[A-Z][a-z]+\s+\d{4}\b/);
    return textMatch ? textMatch[0] : null;
}

async function searchCompanyInNetherlands(companyName) {
    const matches = await searchCompanyInNetherlandsByQuery(companyName);
    const searchQuery = companyName.toLowerCase();
    console.log('Скачиваю и анализирую список спонсоров Нидерландов...');

    if (matches.length > 0) {
        console.log(`\n✅ Найдено совпадений: ${matches.length}\n`);
        matches.slice(0, 20).forEach(item => {
            console.log(`🏢 Компания: ${item.name}`);
            console.log('📍 Страна: Нидерланды');
            console.log('🎫 Статус: признанный спонсор');
            console.log('-'.repeat(40));
        });

        if (matches.length > 20) {
            console.log(`... и ещё ${matches.length - 20} совпадений.`);
        }
    } else {
        console.log(`\n❌ Компания с ключевым словом "${companyName}" не найдена в регистрах Нидерландов.`);
    }

    return matches;
}

async function searchCompanyInNetherlandsByQuery(companyName) {
    const searchQuery = companyName.toLowerCase();

    try {
        const { data } = await axios.get(NETHERLANDS_PAGE_URL, {
            timeout: 30000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const updatedDate = extractNetherlandsUpdatedDate(data);
        const $ = cheerio.load(data);
        const companyNames = $('th[scope="row"]').map((index, element) => $(element).text().replace(/\s+/g, ' ').trim()).get();
        return companyNames
            .filter(name => name.toLowerCase().includes(searchQuery))
            .map(name => ({
                name,
                country: 'Нидерланды',
                type: 'Признанный спонсор',
                status: 'active',
                date: updatedDate
            }));
    } catch (error) {
        console.error('Ошибка при обработке страницы Нидерландов:', error.message);
        return [];
    }
}

// Функция для скачивания CSV и поиска компании
async function searchCompanyByCsv(csvUrl, companyName) {
    const fileDate = extractDateFromFilename(csvUrl);

    try {
        const { data } = await axios.get(csvUrl, { timeout: 30000 });

        const lines = data.split('\n');
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        const nameIdx = headers.indexOf('Organisation Name');
        const cityIdx = headers.indexOf('Town/City');
        const countyIdx = headers.indexOf('County');
        const typeIdx = headers.indexOf('Route');
        const statusIdx = headers.indexOf('Rating');

        const searchQuery = companyName.toLowerCase();
        const matches = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const columns = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());
            const orgName = columns[nameIdx] || '';

            if (orgName.toLowerCase().includes(searchQuery)) {
                matches.push({
                    name: orgName,
                    city: columns[cityIdx] || 'Н/Д',
                    county: columns[countyIdx] || 'Н/Д',
                    type: columns[typeIdx] || 'Н/Д',
                    status: columns[statusIdx] || 'Н/Д',
                    date: fileDate,
                    country: 'United Kingdom'
                });
            }
        }

        return matches;
    } catch (error) {
        console.error('Ошибка при обработке CSV-файла:', error.message);
        return [];
    }
}

async function searchCompany(csvUrl, companyName) {
    const fileDate = extractDateFromFilename(csvUrl);
    console.log('Скачиваю и анализирую самый свежий список спонсоров...');
    if (fileDate) {
        console.log(`📅 Дата файла: ${fileDate}\n`);
    }

    const matches = await searchCompanyByCsv(csvUrl, companyName);

    if (matches.length > 0) {
        const dateInfo = fileDate ? ` (на дату: ${fileDate})` : '';
        console.log(`\n✅ Найдено совпадений: ${matches.length}${dateInfo}\n`);
        matches.forEach(company => {
            console.log(`🏢 Компания: ${company.name}`);
            console.log(`📍 Локация: ${company.city}, ${company.county}`);
            console.log(`🎫 Тип визы: ${company.type} (${company.status})`);
            console.log('-'.repeat(40));
        });
    } else {
        console.log(`\n❌ Компания с ключевым словом "${companyName}" не найдена.`);
    }

    return matches;
}

async function main() {
    const { country, query } = parseSearchRequest(process.argv.slice(2));

    if (!query) {
        console.log('Пожалуйста, укажите название компании и страну при необходимости. Примеры:\nnode search.js "Google"\nnode search.js "phast" netherlands\nnode search.js --country netherlands "phast"');
        process.exit(1);
    }

    if (country === 'netherlands') {
        await searchCompanyInNetherlands(query);
        return;
    }

    const csvLink = await getLatestCsvUrl();

    if (csvLink) {
        await searchCompany(csvLink, query);
    } else {
        console.error('Не удалось найти ссылку на актуальный CSV-файл на странице.');
    }
}

module.exports = {
    parseSearchRequest,
    COUNTRY_ALIASES,
    getLatestCsvUrl,
    searchCompanyInNetherlandsByQuery,
    searchCompanyByCsv,
    searchCompanyInNetherlands,
    searchCompany
};

if (require.main === module) {
    main();
}
