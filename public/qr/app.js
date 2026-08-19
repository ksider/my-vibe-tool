/*
  Генератор QR-кодов с логотипом в центре (офлайн)
  Использует библиотеку qr-code-styling (vendor/qr-code-styling.js)
*/

(function(){
  const AVAILABLE_LANGS = ['ru', 'en'];
  const FALLBACK_LANG = 'ru';
  const TRANSLATIONS = {
    ru: {
      pageTitle: 'Генератор QR-кодов',
      appTitle: 'Генератор QR-кодов',
      appSubtitle: 'Настройте внешний вид QR-кода',
      sectionContent: 'Содержимое',
      textLabel: 'Текст или URL',
      textPlaceholder: 'Введите текст, ссылку или любые данные',
      sectionSizing: 'Размер и точность',
      eccLabel: 'Коррекция ошибок',
      eccL: 'L (наименьшая, больше данных)',
      eccM: 'M',
      eccQ: 'Q',
      eccH: 'H (наибольшая, устойчивее с логотипом)',
      sizeLabel: 'Размер (пикс.)',
      marginLabel: 'Отступ (модули)',
      sectionModules: 'Модули и цвета',
      fgLabel: 'Цвет QR',
      bgLabel: 'Фон',
      modulesShapeLabel: 'Форма модулей',
      modulesSquare: 'Классические',
      modulesRounded: 'Скруглённые',
      modulesDots: 'Круглые точки',
      modulesClassy: 'Classy',
      modulesClassyRounded: 'Classy округлённые',
      modulesExtraRounded: 'Максимальное скругление',
      sectionCorners: 'Углы',
      cornerSquareLabel: 'Узоры углов (наружные)',
      cornerSquareClassic: 'Классические',
      cornerSquareRounded: 'Скруглённые',
      cornerSquareDot: 'Точки',
      cornerDotLabel: 'Узоры углов (внутренние)',
      cornerDotDot: 'Точка',
      cornerDotSquare: 'Квадрат',
      cornerDotNone: 'Без оформления',
      cornerSquareColorLabel: 'Цвет углов (наружные)',
      cornerDotColorLabel: 'Цвет углов (внутренние)',
      sectionLogo: 'Логотип',
      logoLabel: 'Логотип (PNG/JPG/SVG)',
      logoSizeLabel: 'Размер логотипа (%)',
      logoPaddingLabel: 'Отступ изображения (пикс.)',
      btnGenerate: 'Сгенерировать',
      btnDownloadPng: 'Скачать PNG',
      btnDownloadSvg: 'Скачать SVG',
      btnClearLogo: 'Очистить логотип',
      btnCopyLink: 'Скопировать ссылку',
      btnReset: 'Сбросить настройки',
      previewAria: 'Предпросмотр QR',
      langSwitcherAria: 'Переключатель языка',
      colorPickerAria: 'Выбор цвета',
      errorCanvasMissing: 'Не найден контейнер для предпросмотра QR.',
      errorLibraryMissing: 'Библиотека qr-code-styling не найдена.',
      errorRender: 'Не удалось создать QR с текущими параметрами. Попробуйте изменить настройки.',
      errorDownload: 'Не удалось сохранить файл.',
      errorLogoLoad: 'Не удалось загрузить логотип.',
      errorLogoLoadTryAnother: 'Не удалось загрузить логотип. Попробуйте другой файл.',
      errorLogoRead: 'Ошибка чтения файла логотипа.',
      warnLogoDataUrl: 'Не удалось загрузить логотип из data URL.',
      copySuccess: 'Ссылка с настройками скопирована.',
      copyError: 'Не удалось скопировать ссылку. Скопируйте вручную из адресной строки.',
    },
    en: {
      pageTitle: 'QR Code Generator',
      appTitle: 'QR Code Generator',
      appSubtitle: 'Fine-tune the look of your QR code',
      sectionContent: 'Content',
      textLabel: 'Text or URL',
      textPlaceholder: 'Enter text, link, or any data',
      sectionSizing: 'Size & Accuracy',
      eccLabel: 'Error correction',
      eccL: 'L (lowest, more data)',
      eccM: 'M',
      eccQ: 'Q',
      eccH: 'H (highest, better with logo)',
      sizeLabel: 'Size (px)',
      marginLabel: 'Margin (modules)',
      sectionModules: 'Modules & Colors',
      fgLabel: 'QR color',
      bgLabel: 'Background',
      modulesShapeLabel: 'Module style',
      modulesSquare: 'Classic',
      modulesRounded: 'Rounded',
      modulesDots: 'Dots',
      modulesClassy: 'Classy',
      modulesClassyRounded: 'Classy rounded',
      modulesExtraRounded: 'Extra rounded',
      sectionCorners: 'Corners',
      cornerSquareLabel: 'Corner patterns (outer)',
      cornerSquareClassic: 'Classic',
      cornerSquareRounded: 'Rounded',
      cornerSquareDot: 'Dots',
      cornerDotLabel: 'Corner patterns (inner)',
      cornerDotDot: 'Dot',
      cornerDotSquare: 'Square',
      cornerDotNone: 'None',
      cornerSquareColorLabel: 'Corner color (outer)',
      cornerDotColorLabel: 'Corner color (inner)',
      sectionLogo: 'Logo',
      logoLabel: 'Logo (PNG/JPG/SVG)',
      logoSizeLabel: 'Logo size (%)',
      logoPaddingLabel: 'Logo padding (px)',
      btnGenerate: 'Generate',
      btnDownloadPng: 'Download PNG',
      btnDownloadSvg: 'Download SVG',
      btnClearLogo: 'Clear logo',
      btnCopyLink: 'Copy link',
      btnReset: 'Reset settings',
      previewAria: 'QR preview',
      langSwitcherAria: 'Language selector',
      colorPickerAria: 'Select color',
      errorCanvasMissing: 'Preview container not found.',
      errorLibraryMissing: 'qr-code-styling library not found.',
      errorRender: 'Failed to generate a QR code with the current settings. Please adjust the configuration.',
      errorDownload: 'Could not save the file.',
      errorLogoLoad: 'Could not load the logo.',
      errorLogoLoadTryAnother: 'Could not load the logo. Try a different file.',
      errorLogoRead: 'Error reading the logo file.',
      warnLogoDataUrl: 'Could not load logo from data URL.',
      copySuccess: 'Settings link copied.',
      copyError: 'Could not copy link. Please copy it manually from the address bar.',
    },
  };

  const STATE_CONTROL_MAP = {
    text: 'text',
    ecc: 'ecc',
    size: 'size',
    margin: 'margin',
    fg: 'fg',
    bg: 'bg',
    quiet: 'quiet',
    cornerSquare: 'cornerSquare',
    cornerSquareColor: 'cornerSquareColor',
    cornerDot: 'cornerDot',
    cornerDotColor: 'cornerDotColor',
    logoSize: 'logoSize',
    logoPad: 'logoPad',
  };

  const STATE_KEYS = Object.keys(STATE_CONTROL_MAP);

  const DEFAULT_STATE = {
    text: 'https://nikolaysemenov.ru/qr',
    ecc: 'H',
    size: '1024',
    margin: '2',
    fg: '#1B2923',
    bg: '#ffffff',
    quiet: 'square',
    cornerSquare: 'square',
    cornerSquareColor: '#1B2923',
    cornerDot: 'dot',
    cornerDotColor: '#1B2923',
    logoSize: '55',
    logoPad: '8',
  };

  const COLOR_STATE_KEYS = new Set(['fg', 'bg', 'cornerSquareColor', 'cornerDotColor']);

  function normalizeLang(lang){
    if (!lang) return null;
    const lower = String(lang).toLowerCase();
    if (AVAILABLE_LANGS.includes(lower)) return lower;
    const prefix = lower.split('-')[0];
    return AVAILABLE_LANGS.includes(prefix) ? prefix : null;
  }

  function safeGetStorage(key){
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (err){
      return null;
    }
  }

  function safeSetStorage(key, value){
    try {
      if (window.localStorage){
        window.localStorage.setItem(key, value);
      }
    } catch (err){
      // ignore storage errors
    }
  }

  function detectInitialLang(){
    const stored = normalizeLang(safeGetStorage('qrLang'));
    if (stored) return stored;
    if (Array.isArray(navigator.languages)){
      for (const lng of navigator.languages){
        const normalized = normalizeLang(lng);
        if (normalized) return normalized;
      }
    }
    return normalizeLang(navigator.language) || FALLBACK_LANG;
  }

  let currentLang = detectInitialLang();
  let isApplyingState = false;

  function getDict(lang){
    return TRANSLATIONS[lang] || TRANSLATIONS[FALLBACK_LANG];
  }

  function translateKey(key, lang = currentLang){
    const dict = getDict(lang);
    const fallbackDict = getDict(FALLBACK_LANG);
    if (dict && Object.prototype.hasOwnProperty.call(dict, key)){
      return dict[key];
    }
    if (fallbackDict && Object.prototype.hasOwnProperty.call(fallbackDict, key)){
      return fallbackDict[key];
    }
    return key;
  }

  function updateLangButtons(lang){
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  function applyTranslations(lang){
    const dict = getDict(lang);
    const fallbackDict = getDict(FALLBACK_LANG);
    document.querySelectorAll('[data-i18n-key]').forEach(el => {
      const key = el.dataset.i18nKey;
      if (!key) return;
      const target = el.dataset.i18nTarget || 'text';
      const value = Object.prototype.hasOwnProperty.call(dict, key)
        ? dict[key]
        : (fallbackDict && Object.prototype.hasOwnProperty.call(fallbackDict, key) ? fallbackDict[key] : key);
      switch (target){
        case 'text':
          el.textContent = value;
          break;
        case 'html':
          el.innerHTML = value;
          break;
        case 'placeholder':
          el.setAttribute('placeholder', value);
          el.placeholder = value;
          break;
        case 'aria-label':
          el.setAttribute('aria-label', value);
          break;
        default:
          if (target in el){
            el[target] = value;
          } else {
            el.setAttribute(target, value);
          }
      }
    });
    document.title = translateKey('pageTitle', lang);
    document.documentElement.lang = lang;
    updateLangButtons(lang);
  }

  function setLanguage(lang, {store = true, sync = true} = {}){
    const normalized = normalizeLang(lang) || FALLBACK_LANG;
    currentLang = normalized;
    applyTranslations(normalized);
    if (store){
      safeSetStorage('qrLang', normalized);
    }
    if (sync){
      syncStateToUrl();
    }
  }

  function t(key){
    return translateKey(key, currentLang);
  }

  setLanguage(currentLang, {store: false, sync: false});

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang, {store: true});
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'qrLang' && event.newValue){
      setLanguage(event.newValue, {store: false});
    }
  });

  const els = {
    text: document.getElementById('text'),
    ecc: document.getElementById('ecc'),
    size: document.getElementById('size'),
    sizeVal: document.getElementById('sizeVal'),
    margin: document.getElementById('margin'),
    marginVal: document.getElementById('marginVal'),
    fg: document.getElementById('fg'),
    bg: document.getElementById('bg'),
    quiet: document.getElementById('quiet'),
    cornerSquare: document.getElementById('cornerSquare'),
    cornerSquareColor: document.getElementById('cornerSquareColor'),
    cornerDot: document.getElementById('cornerDot'),
    cornerDotColor: document.getElementById('cornerDotColor'),
    logo: document.getElementById('logo'),
    logoSize: document.getElementById('logoSize'),
    logoSizeVal: document.getElementById('logoSizeVal'),
    logoPad: document.getElementById('logoPad'),
    logoPadVal: document.getElementById('logoPadVal'),
    btnGenerate: document.getElementById('btnGenerate'),
    btnCopyLink: document.getElementById('btnCopyLink'),
    btnResetDefaults: document.getElementById('btnResetDefaults'),
    btnDownload: document.getElementById('btnDownload'),
    btnDownloadSvg: document.getElementById('btnDownloadSvg'),
    btnClearLogo: document.getElementById('btnClearLogo'),
    canvas: document.getElementById('canvas'),
  };

  const initialParams = new URLSearchParams(window.location.search);
  applyStateFromParams(initialParams, {render: false, sync: false});

  function setSelectValue(selectEl, value, fallback){
    if (!selectEl) return;
    const options = Array.from(selectEl.options).map(opt => opt.value);
    const desired = typeof value === 'string' && options.includes(value) ? value : null;
    const fallbackValue = options.includes(fallback) ? fallback : options[0];
    const finalValue = desired || fallbackValue || '';
    if (finalValue){
      selectEl.value = finalValue;
    }
  }

  function setRangeValue(rangeEl, value, fallback){
    if (!rangeEl) return;
    const min = rangeEl.min !== '' ? parseFloat(rangeEl.min) : null;
    const max = rangeEl.max !== '' ? parseFloat(rangeEl.max) : null;
    const step = rangeEl.step !== '' ? parseFloat(rangeEl.step) : null;
    const rawNumber = parseFloat(value);
    const fallbackNumber = parseFloat(fallback);
    let numeric = Number.isFinite(rawNumber) ? rawNumber : fallbackNumber;
    if (!Number.isFinite(numeric)){
      numeric = Number.isFinite(fallbackNumber) ? fallbackNumber : rawNumber;
    }
    if (Number.isFinite(min)) numeric = Math.max(numeric, min);
    if (Number.isFinite(max)) numeric = Math.min(numeric, max);
    if (Number.isFinite(step) && step > 0){
      const base = Number.isFinite(min) ? min : 0;
      numeric = Math.round((numeric - base) / step) * step + base;
      if (Number.isFinite(min)) numeric = Math.max(numeric, min);
      if (Number.isFinite(max)) numeric = Math.min(numeric, max);
    }
    rangeEl.value = String(numeric);
  }

  function isValidHexColor(value){
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed);
  }

  function setColorValue(inputEl, value, fallback){
    if (!inputEl) return;
    const candidate = isValidHexColor(value) ? value.trim() : null;
    const finalColor = candidate || (isValidHexColor(fallback) ? fallback : inputEl.value);
    if (finalColor){
      inputEl.value = finalColor.toUpperCase();
    }
  }

  function updateRangeOutputs(){
    if (els.size && els.sizeVal){
      els.sizeVal.textContent = els.size.value;
    }
    if (els.margin && els.marginVal){
      els.marginVal.textContent = els.margin.value;
    }
    if (els.logoSize && els.logoSizeVal){
      els.logoSizeVal.textContent = els.logoSize.value;
    }
    if (els.logoPad && els.logoPadVal){
      els.logoPadVal.textContent = els.logoPad.value;
    }
  }

  function applyControlsFromState(state){
    isApplyingState = true;
    try {
      if (els.text){
        els.text.value = typeof state.text === 'string' ? state.text : DEFAULT_STATE.text;
      }
      setSelectValue(els.ecc, state.ecc, DEFAULT_STATE.ecc);
      setRangeValue(els.size, state.size, DEFAULT_STATE.size);
      setRangeValue(els.margin, state.margin, DEFAULT_STATE.margin);
      setColorValue(els.fg, state.fg, DEFAULT_STATE.fg);
      setColorValue(els.bg, state.bg, DEFAULT_STATE.bg);
      setSelectValue(els.quiet, state.quiet, DEFAULT_STATE.quiet);
      setSelectValue(els.cornerSquare, state.cornerSquare, DEFAULT_STATE.cornerSquare);
      setColorValue(els.cornerSquareColor, state.cornerSquareColor, DEFAULT_STATE.cornerSquareColor);
      setSelectValue(els.cornerDot, state.cornerDot, DEFAULT_STATE.cornerDot);
      setColorValue(els.cornerDotColor, state.cornerDotColor, DEFAULT_STATE.cornerDotColor);
      setRangeValue(els.logoSize, state.logoSize, DEFAULT_STATE.logoSize);
      setRangeValue(els.logoPad, state.logoPad, DEFAULT_STATE.logoPad);
    } finally {
      isApplyingState = false;
    }
    updateRangeOutputs();
  }

  function collectStateFromControls(){
    const state = {};
    STATE_KEYS.forEach(key => {
      const controlKey = STATE_CONTROL_MAP[key];
      const control = els[controlKey];
      if (!control) return;
      state[key] = control.value;
    });
    return state;
  }

  function updateQueryIndicators(hasQuery){
    if (els.btnCopyLink){
      els.btnCopyLink.classList.toggle('has-query', hasQuery);
    }
    if (els.btnResetDefaults){
      els.btnResetDefaults.classList.toggle('has-query', hasQuery);
      els.btnResetDefaults.disabled = !hasQuery;
      els.btnResetDefaults.setAttribute('aria-disabled', String(!hasQuery));
    }
  }

  function syncStateToUrl(){
    if (isApplyingState) return;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const state = collectStateFromControls();
    let mutated = false;

    STATE_KEYS.forEach(key => {
      const value = state[key];
      const defaultValue = DEFAULT_STATE[key];
      const stringValue = value != null ? String(value) : '';
      const defaultString = defaultValue != null ? String(defaultValue) : '';
      const comparableValue = COLOR_STATE_KEYS.has(key) ? stringValue.toUpperCase() : stringValue;
      const comparableDefault = COLOR_STATE_KEYS.has(key) ? defaultString.toUpperCase() : defaultString;
      if (comparableValue === comparableDefault || comparableValue === '' && comparableDefault === ''){
        if (params.has(key)){
          params.delete(key);
          mutated = true;
        }
      } else if (params.get(key) !== stringValue){
        params.set(key, stringValue);
        mutated = true;
      }
    });

    const newSearch = params.toString();
    const currentSearch = window.location.search.replace(/^\?/, '');
    updateQueryIndicators(newSearch.length > 0);
    if (!mutated && newSearch === currentSearch){
      return;
    }

    const newUrl = `${url.pathname}${newSearch ? `?${newSearch}` : ''}${url.hash}`;
    if (newUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`){
      history.replaceState(null, '', newUrl);
    }
  }

  function applyStateFromParams(params, {render = true, sync = false} = {}){
    const state = {};
    STATE_KEYS.forEach(key => {
      if (params.has(key)){
        state[key] = params.get(key);
      }
    });
    applyControlsFromState(state);
    updateQueryIndicators(params.toString().length > 0);
    if (render){
      renderQR();
    }
    if (sync){
      syncStateToUrl();
    }
  }

  if (!els.canvas){
    console.error(t('errorCanvasMissing'));
    return;
  }

  if (typeof QRCodeStyling === 'undefined'){
    console.error(t('errorLibraryMissing'));
    return;
  }

  const container = els.canvas;

  let qrCode = null;
  let logoDataUrl = null;

  function clamp(n, min, max){
    return Math.max(min, Math.min(max, n));
  }

  function getDotsType(){
    const val = (els.quiet && els.quiet.value || 'square').toLowerCase();
    const supported = ['square', 'rounded', 'dots', 'classy', 'classy-rounded', 'extra-rounded'];
    return supported.includes(val) ? val : 'square';
  }

  function estimateMarginPx(size){
    const marginModules = clamp(parseInt(els.margin.value, 10) || 4, 0, 32);
    const base = Math.max(size / 40, 2);
    return Math.round(base * marginModules);
  }

  function collectCornerOptions(typeEl, colorEl){
    if (!typeEl) return null;
    const typeRaw = String(typeEl.value || '').toLowerCase();
    if (!typeRaw || typeRaw === 'none'){
      return null;
    }
    const options = { type: typeRaw };
    const colorVal = colorEl && colorEl.value;
    if (colorVal && typeof colorVal === 'string'){
      options.color = colorVal;
    }
    return options;
  }

  function buildOptions(){
    const text = (els.text.value || '').trim() || 'Hello, QR!';
    const size = clamp(parseInt(els.size.value, 10) || 320, 64, 2048);
    const ecc = (els.ecc.value || 'M').toUpperCase();
    const fg = els.fg.value || '#000000';
    const bg = els.bg.value || '#ffffff';
    const margin = estimateMarginPx(size);
    const logoPercent = clamp(parseInt(els.logoSize.value, 10) || 40, 5, 95) / 100;
    const logoMargin = clamp(parseInt(els.logoPad.value, 10) || 0, 0, 256);

    const imageOptions = {
      crossOrigin: 'anonymous',
      margin: logoMargin,
      hideBackgroundDots: !!logoDataUrl,
      imageSize: logoPercent,
    };

    const cornersSquareOptions = collectCornerOptions(els.cornerSquare, els.cornerSquareColor);
    const cornersDotOptions = collectCornerOptions(els.cornerDot, els.cornerDotColor);
    if (cornersSquareOptions && !cornersSquareOptions.color){
      cornersSquareOptions.color = fg;
    }
    if (cornersDotOptions && !cornersDotOptions.color){
      cornersDotOptions.color = fg;
    }

    const options = {
      width: size,
      height: size,
      data: text,
      image: logoDataUrl || '',
      margin,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: ecc,
      },
      backgroundOptions: {
        color: bg,
      },
      dotsOptions: {
        color: fg,
        type: getDotsType(),
      },
      imageOptions,
    };

    if (cornersSquareOptions){
      options.cornersSquareOptions = cornersSquareOptions;
    }
    if (cornersDotOptions){
      options.cornersDotOptions = cornersDotOptions;
    }

    return options;
  }

  function renderQR(){
    try {
      const options = buildOptions();
      if (!qrCode){
        qrCode = new QRCodeStyling(options);
        container.innerHTML = '';
        qrCode.append(container);
      } else {
        qrCode.update(options);
      }
    } catch (err){
      console.error(err);
      alert(t('errorRender'));
    }
  }

  function download(extension){
    if (!qrCode){
      renderQR();
    }
    if (!qrCode){
      return;
    }
    try {
      qrCode.download({ name: 'qr', extension });
    } catch (err){
      console.error(err);
      alert(t('errorDownload'));
    }
  }

  async function copySettingsLink(){
    try {
      syncStateToUrl();
      const url = window.location.href;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function'){
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand ? document.execCommand('copy') : false;
        document.body.removeChild(textarea);
        if (!success){
          throw new Error('execCommand copy failed');
        }
      }
      alert(t('copySuccess'));
    } catch (err){
      console.error(err);
      alert(t('copyError'));
    }
  }

  function resetToDefaults(){
    applyControlsFromState(DEFAULT_STATE);
    renderQR();
    syncStateToUrl();
  }

  function handleLogoFile(file){
    if (!file){
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl){
        alert(t('errorLogoLoad'));
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        logoDataUrl = dataUrl;
        renderQR();
      };
      img.onerror = () => {
        alert(t('errorLogoLoadTryAnother'));
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      alert(t('errorLogoRead'));
    };
    reader.readAsDataURL(file);
  }

  function loadLogoDataUrl(dataUrl){
    if (!dataUrl || typeof dataUrl !== 'string'){
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      logoDataUrl = dataUrl;
      renderQR();
    };
    img.onerror = () => {
      console.warn(t('warnLogoDataUrl'));
    };
    img.src = dataUrl;
  }

  function handleControlInput(){
    updateRangeOutputs();
    renderQR();
    if (!isApplyingState){
      syncStateToUrl();
    }
  }

  [
    els.text,
    els.ecc,
    els.size,
    els.margin,
    els.fg,
    els.bg,
    els.quiet,
    els.cornerSquare,
    els.cornerSquareColor,
    els.cornerDot,
    els.cornerDotColor,
    els.logoSize,
    els.logoPad,
  ].forEach(el => {
    if (!el) return;
    el.addEventListener('input', handleControlInput);
    el.addEventListener('change', handleControlInput);
  });

  els.logo.addEventListener('change', () => handleLogoFile(els.logo.files[0]));

  els.btnGenerate.addEventListener('click', (e) => {
    e.preventDefault();
    renderQR();
  });
  if (els.btnCopyLink){
    els.btnCopyLink.addEventListener('click', async (e) => {
      e.preventDefault();
      await copySettingsLink();
    });
  }
  if (els.btnResetDefaults){
    els.btnResetDefaults.addEventListener('click', (e) => {
      e.preventDefault();
      if (!els.btnResetDefaults.disabled){
        resetToDefaults();
      }
    });
  }
  els.btnDownload.addEventListener('click', (e) => {
    e.preventDefault();
    download('png');
  });
  els.btnDownloadSvg.addEventListener('click', (e) => {
    e.preventDefault();
    download('svg');
  });
  els.btnClearLogo.addEventListener('click', (e) => {
    e.preventDefault();
    els.logo.value = '';
    logoDataUrl = null;
    renderQR();
    syncStateToUrl();
  });

  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    applyStateFromParams(params, {render: true, sync: false});
  });

  window.addEventListener('load', () => {
    try {
      renderQR();
      syncStateToUrl();
      if (window.DEFAULT_LOGO_DATA_URL){
        loadLogoDataUrl(String(window.DEFAULT_LOGO_DATA_URL));
      } else if (logoDataUrl){
        loadLogoDataUrl(logoDataUrl);
      }
    } catch (err){
      console.error(err);
    }
  });
})();
