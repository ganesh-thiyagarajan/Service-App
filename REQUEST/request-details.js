document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const row = urlParams.get('row');
  const machineNumber = urlParams.get('machineNumber');
  const functionName = urlParams.get('function');
  fetchDetails(row, machineNumber, functionName);
});

function fetchDetails(row, machineNumber, functionName) {
  const scriptUrl = `https://script.google.com/macros/s/AKfycbyK181M4LZmS5h-7TabxoKLl9UoHbInO1HZYej1khIzAUgcrYujm2WufnYUymHNHt-J/exec?action=fetchDetails&row=${row}`;

  fetch(scriptUrl)
    .then(response => response.json())
    .then(data => {
      populateDetails(data, machineNumber, functionName, row);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const container = document.getElementById('details-container');
      container.innerHTML = '<p>Failed to load details</p>';
    });
}

function populateDetails(data, machineNumber, functionName, row) {
  const container = document.getElementById('details-container');
  container.innerHTML = ''; // Clear existing items

  const details = `
    <div class="detail-header">
      <h2>${data.employeeName}</h2>
      <p>${machineNumber} : ${functionName}</p>
    </div>
    ${generateContent(data.contents)}
  `;

  container.innerHTML = details;

  // Append the button after the details have been populated
  const solveButton = document.createElement('button');
  solveButton.id = 'solve-button';
  solveButton.textContent = 'Solved';
  solveButton.onclick = () => markAsSolved(row);
  container.appendChild(solveButton);
}

function generateContent(contents) {
  const containerColumns = [1, 3, 5, 7, 9, 11]; // Columns I, K, M, O, Q, S
  let contentHtml = '';

  // Include column H first
  if (contents[0]) {
    contentHtml += `
      <div class="detail-item">
        <p>${contents[0]}</p>
      </div>
    `;
  }

  for (let i = 1; i < contents.length; i++) {
    if (containerColumns.includes(i) && contents[i]) {
      contentHtml += `
        <div class="detail-item">
          <p class="content">${contents[i]}</p>
        </div>
      `;
    } else if (contents[i]) {
      contentHtml += `
        <div class="detail-item">
          <p>${contents[i]}</p>
        </div>
      `;
    }
  }

  return contentHtml;
}

function markAsSolved(row) {
  const scriptUrl = `https://script.google.com/macros/s/AKfycbwrAiSLKfpmP-5dbR4r9HaBZwdqL6lJvAdYEz3Ul45Ddo1C-pLc_ZpTy1ydmi-qI6E/exec`;

  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      action: 'markAsSolved',
      row: row
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        alert('Request marked as solved.');
        // Optionally, redirect or update the page
      } else {
        alert('Failed to mark request as solved.');
      }
    })
    .catch(error => {
      console.error('Error marking request as solved:', error);
      alert('An error occurred.');
    });
}
