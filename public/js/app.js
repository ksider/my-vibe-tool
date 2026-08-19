const countryButtons = [...document.querySelectorAll('.country-option')];
const queryInput = document.getElementById('query');
const form = document.getElementById('search-form');
const resultsPanel = document.getElementById('results');
const resultsTitle = document.getElementById('results-title');
const resultsMeta = document.getElementById('results-meta');
const statusMessage = document.getElementById('status-message');
const resultsList = document.getElementById('results-list');
let country = new URLSearchParams(window.location.search).get('country') === 'netherlands' ? 'netherlands' : 'uk';

const recentSearchesPanel = document.getElementById('recent-searches');
const recentList = document.getElementById('recent-list');
const HISTORY_KEY = 'sponsorSearchHistory';
const HISTORY_LIMIT = 3;

function updateCountryUI() {
  countryButtons.forEach(button => {
    const active = button.dataset.country === country;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function addChip(parent, text) {
  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = text;
  parent.appendChild(chip);
}

function renderResults(payload) {
  resultsPanel.classList.remove('hidden');
  resultsTitle.textContent = payload.query ? `Results for “${payload.query}”` : 'Search results';
  resultsMeta.textContent = `${payload.total} match${payload.total === 1 ? '' : 'es'}`;
  statusMessage.textContent = payload.error || `${payload.source || 'Register'} • ${payload.sourceDate || 'date unavailable'}`;
  statusMessage.className = `status-message ${payload.error ? 'error' : 'success'}`;
  resultsList.replaceChildren();
  if (!payload.matches?.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-result';
    empty.textContent = 'No matching companies found.';
    resultsList.appendChild(empty);
    return;
  }
  payload.matches.forEach(item => {
    const card = document.createElement('article');
    card.className = 'result-card';
    const title = document.createElement('h4');
    title.textContent = item.name;
    const meta = document.createElement('div');
    meta.className = 'chips';
    addChip(meta, item.country || 'Register');
    addChip(meta, item.type || 'Sponsor');
    addChip(meta, item.status || 'Active');
    addChip(meta, item.date ? `Updated ${item.date}` : 'Date unavailable');
    card.append(title, meta);
    resultsList.appendChild(card);
  });
}

async function search(countryValue, query) {
  if (!query.trim()) {
    renderResults({ query: '', total: 0, matches: [], error: 'Please enter a company name.' });
    return;
  }
  saveToHistory(countryValue, query);            // ← добавить
  recentSearchesPanel?.classList.add('hidden');   // ← добавить (скрыть список при активном поиске)

  statusMessage.textContent = 'Loading register...';
  statusMessage.className = 'status-message';
  resultsPanel.classList.remove('hidden');
  try {
    const response = await fetch(`/api/search?${new URLSearchParams({ country: countryValue, q: query })}`);
    const payload = await response.json();
    renderResults(payload);
  } catch (error) {
    renderResults({ query, total: 0, matches: [], error: `Search failed: ${error.message}` });
  }
}

countryButtons.forEach(button => button.addEventListener('click', () => {
  country = button.dataset.country;
  updateCountryUI();
  if (queryInput.value.trim()) search(country, queryInput.value.trim());
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const url = new URL(window.location.href);
  url.searchParams.set('country', country);
  if (queryInput.value.trim()) url.searchParams.set('q', queryInput.value.trim());
  else url.searchParams.delete('q');
  history.pushState({}, '', url);
  search(country, queryInput.value.trim());
});

updateCountryUI();
const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
queryInput.value = initialQuery;
// if (initialQuery) search(country, initialQuery);
if (initialQuery) {
  search(country, initialQuery);
} else {
  renderHistory();   // ← добавить: показать историю только на «чистой» стартовой странице
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToHistory(countryValue, query) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const entries = loadHistory().filter(e => !(e.query === trimmed && e.country === countryValue));
  entries.unshift({ query: trimmed, country: countryValue });
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)));
  } catch {
    // приватный режим / квота исчерпана — просто не сохраняем
  }
}

function renderHistory() {
  const entries = loadHistory();
  if (!recentSearchesPanel || !recentList || !entries.length) {
    recentSearchesPanel?.classList.add('hidden');
    return;
  }
  recentList.replaceChildren();
  entries.forEach(entry => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'recent-item';
    btn.textContent = `${entry.query} · ${entry.country === 'netherlands' ? 'NL' : 'UK'}`;
    btn.addEventListener('click', () => {
      country = entry.country;
      queryInput.value = entry.query;
      updateCountryUI();
      const url = new URL(window.location.href);
      url.searchParams.set('country', entry.country);
      url.searchParams.set('q', entry.query);
      history.pushState({}, '', url);
      search(country, entry.query);
    });
    recentList.appendChild(btn);
  });
  recentSearchesPanel.classList.remove('hidden');
}