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

renderSponsorHistory();
