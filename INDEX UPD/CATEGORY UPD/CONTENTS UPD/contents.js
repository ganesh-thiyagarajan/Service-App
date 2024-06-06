document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const rowData = urlParams.get('category');
  const categoryData = JSON.parse(decodeURIComponent(rowData));
  const machineVariant = urlParams.get('topic');
  const categoryName = urlParams.get('categoryName');  // Get the category name from URL
  const employeeId = sessionStorage.getItem('employeeId');

  // Display the machine variant and category
  const topicContainer = document.getElementById('topic-container');
  topicContainer.textContent = `Machine Variant: ${machineVariant}`;

  const categoryContainer = document.getElementById('category-container');
  categoryContainer.textContent = `Category: ${categoryName}`;

  // Fetch and display employee name
  fetchEmployeeName(employeeId);

  fetchContents(categoryData);

  // Add event listener for the "Request Support" button
  document.getElementById('submit-request').addEventListener('click', function() {
    requestSupport(machineVariant, categoryName, employeeId);
  });
});

function fetchEmployeeName(employeeId) {
  const scriptUrl = `https://script.google.com/macros/s/AKfycbzOQpm-OTm8QeCplGrUmHKlavhf-noxyq1bAJffHJu45fmRKpaDEqqgF6FhDJNb1g82/exec?employeeId=${encodeURIComponent(employeeId)}`;

  fetch(scriptUrl)
    .then(response => response.text())
    .then(name => {
      const employeeNameContainer = document.getElementById('employee-name-container');
      employeeNameContainer.textContent = `Welcome, ${name}`;
      sessionStorage.setItem('employeeName', name);
    })
    .catch(error => {
      console.error('Error fetching employee name:', error);
    });
}

function fetchContents(categoryData) {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzOQpm-OTm8QeCplGrUmHKlavhf-noxyq1bAJffHJu45fmRKpaDEqqgF6FhDJNb1g82/exec?category=' + encodeURIComponent(JSON.stringify(categoryData));

  fetch(scriptUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      populateContents(data);
      document.getElementById('submit-request').style.display = 'block';
      document.getElementById('note').style.display = 'block';
      document.getElementById('additional-fields').style.display = 'block';
      document.getElementById('button-container').style.display = 'block'; // Show button container
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const container = document.getElementById('contents-container');
      container.innerHTML = '<p>Failed to load contents</p>';
    });
}

function populateContents(data) {
  const container = document.getElementById('contents-container');
  container.innerHTML = ''; // Clear existing items and loading text

  const [headers, contents] = data;

  if (!Array.isArray(contents)) {
    container.innerHTML = '<p>Failed to load contents</p>';
    return;
  }

  if (contents.length === 0) {
    container.innerHTML = '<p>No contents available</p>';
    return;
  }

  contents.forEach(([, content], index) => {
    if (content) {
      const div = document.createElement('div');
      div.className = 'content-box';
      div.innerHTML = `
        <div class="content-title">Check ${index + 1} : ${content}</div>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" name="check${index}" value="Yes"> Yes
          </label>
          <label>
            <input type="checkbox" name="check${index}" value="No"> No
          </label>
          ${containsMeasurementTerms(content) ? `<input type="text" name="field${index}" placeholder="Enter value">` : ''}
        </div>
      `;
      container.appendChild(div);
    }
  });
}

function containsMeasurementTerms(content) {
  const terms = ['voltage', 'current', 'resistance', 'ohms'];
  return terms.some(term => content.toLowerCase().includes(term));
}

function requestSupport(machineVariant, categoryName, employeeId) {
  const employeeName = sessionStorage.getItem('employeeName');
  const listItems = document.querySelectorAll('#contents-container .content-box');
  const submissionData = [];

  for (const item of listItems) {
    const checkboxes = item.querySelectorAll('input[type="checkbox"]');
    const field = item.querySelector('input[type="text"]');
    const content = item.querySelector('.content-title').innerText;

    let checkboxValue = '';
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        checkboxValue = checkbox.value;
        break;
      }
    }

    if (!checkboxValue || (field && !field.value)) {
      alert(`Please fill all fields for: ${content}`);
      return;
    }

    submissionData.push({
      content,
      checkbox: checkboxValue,
      field: field ? field.value : ''
    });
  }

  const machineNumber = document.getElementById('machine-number').value;
  const observations = document.getElementById('observations').value;

  if (!machineNumber) {
    alert('Please fill the Machine number.');
    return;
  }

  document.getElementById('submitting-text').style.display = 'block';

  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyxo0vztmwW6r84GFmHjpsfS0LE5UHhVpG5e0u-aiv2MlGHzlF6qT80sfA0NjaChFs/exec';

  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `machineVariant=${encodeURIComponent(machineVariant)}&employeeName=${encodeURIComponent(employeeName)}&employeeId=${encodeURIComponent(employeeId)}&machineNumber=${encodeURIComponent(machineNumber)}&category=${encodeURIComponent(categoryName)}&observations=${encodeURIComponent(observations)}&submissionData=${encodeURIComponent(JSON.stringify(submissionData))}`,
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('submitting-text').style.display = 'none';
      if (data.result === 'success') {
        alert('Request raised successfully');
        location.reload(); // Refresh the page
      } else {
        alert('Failed to raise request');
      }
    })
    .catch(error => {
      document.getElementById('submitting-text').style.display = 'none';
      console.error('Error:', error);
    });
}
