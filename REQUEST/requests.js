document.addEventListener('DOMContentLoaded', function() {
  fetchRequests();
});

function fetchRequests() {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyK181M4LZmS5h-7TabxoKLl9UoHbInO1HZYej1khIzAUgcrYujm2WufnYUymHNHt-J/exec?action=fetchRequests';

  fetch(scriptUrl)
    .then(response => response.json())
    .then(data => {
      populateRequests(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const container = document.getElementById('requests-container');
      container.innerHTML = '<p>Failed to load requests</p>';
    });
}

function populateRequests(data) {
  const container = document.getElementById('requests-container');
  container.innerHTML = ''; // Clear existing items

  if (data.length === 0) {
    container.innerHTML = '<p>No requests available</p>';
    return;
  }

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'request-item';
    div.innerHTML = `
      <div class="request-content">
        <strong>${item.employeeName}</strong>
        <p>${item.machineNumber} : ${item.function}</p>
      </div>
      <div class="arrow">&#9654;</div>
    `;
    div.addEventListener('click', () => {
      window.location.href = `request-details.html?row=${item.row}&machineNumber=${item.machineNumber}&function=${item.function}`;
    });
    container.appendChild(div);
  });
}
