const sponsorRecentPanel = document.getElementById('sponsor-recent');
const sponsorRecentList = document.getElementById('sponsor-recent-list');
const sponsorHistoryKey = 'sponsorSearchHistory';

function loadSponsorHistory() {
  try {
    const entries = JSON.parse(localStorage.getItem(sponsorHistoryKey)) || [];
    return entries.filter(entry => entry && typeof entry.query === 'string' && entry.query.trim()).slice(0, 2);
  } catch {
    return [];
  }
}

function renderSponsorHistory() {
  const entries = loadSponsorHistory();
  if (!entries.length || !sponsorRecentPanel || !sponsorRecentList) return;

  entries.forEach(entry => {
    const country = entry.country === 'netherlands' ? 'netherlands' : 'uk';
    const link = document.createElement('a');
    link.className = 'card-recent-link';
    link.href = `/search/?${new URLSearchParams({ country, q: entry.query.trim() })}`;
    link.textContent = `${entry.query.trim()} · ${country === 'netherlands' ? 'NL' : 'UK'}`;
    link.title = link.textContent;
    sponsorRecentList.appendChild(link);
  });

  sponsorRecentPanel.classList.remove('hidden');
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) throw new Error('Copy failed');
}

document.querySelectorAll('.card-credential').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copyValue;
    const label = button.dataset.copyLabel;

    try {
      await copyText(value);
      button.classList.add('is-copied');
      button.setAttribute('aria-label', `${label}: copied`);
      window.setTimeout(() => {
        button.classList.remove('is-copied');
        button.setAttribute('aria-label', label);
      }, 1400);
    } catch {
      button.classList.add('copy-failed');
      button.setAttribute('aria-label', `${label}: copy failed`);
      window.setTimeout(() => {
        button.classList.remove('copy-failed');
        button.setAttribute('aria-label', label);
      }, 1400);
    }
  });
});

renderSponsorHistory();
