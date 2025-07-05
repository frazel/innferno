const templateId = '895730';
const collection = 'inn';
const limit = 1000;

async function fetchTopHolders() {
  const response = await fetch(`https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=${collection}&template_id=${templateId}&page=1&limit=${limit}&order=desc&sort=transferred`);
  const data = await response.json();
  const countMap = {};

  data.data.forEach(asset => {
    const owner = asset.owner;
    countMap[owner] = (countMap[owner] || 0) + 1;
  });

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  const tbody = document.querySelector('#leaderboard tbody');
  sorted.forEach(([wallet, count], i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${i + 1}</td><td><a href="https://wax.atomichub.io/explorer/account/${wallet}" target="_blank">${wallet}</a></td><td>${count}</td>`;
    tbody.appendChild(row);
  });

  window.csvData = sorted;
}

function downloadCSV() {
  if (!window.csvData) return;
  let csv = "Rank,Wallet,Innfernos Held\n";
  window.csvData.forEach(([wallet, count], i) => {
    csv += `${i + 1},${wallet},${count}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = "innfernos_leaderboard.csv";
  link.click();
}

fetchTopHolders();
