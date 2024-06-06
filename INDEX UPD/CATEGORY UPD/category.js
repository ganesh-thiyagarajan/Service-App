document.addEventListener('DOMContentLoaded', function() {


  const urlParams = new URLSearchParams(window.location.search);
  const machineVariant = urlParams.get('topic');
  const employeeId = sessionStorage.getItem('employeeId'); // Assuming you store employeeId in sessionStorage on login

  fetchEmployeeName(employeeId);
  fetchCategories(machineVariant);
});

function fetchEmployeeName(employeeId) {
  const scriptUrl = `https://script.google.com/macros/s/AKfycbzOQpm-OTm8QeCplGrUmHKlavhf-noxyq1bAJffHJu45fmRKpaDEqqgF6FhDJNb1g82/exec?employeeId=${encodeURIComponent(employeeId)}`;

  fetch(scriptUrl)
    .then(response => response.text())
    .then(name => {
      const topicContainer = document.getElementById('Welcome_Employee_Name');
      if (topicContainer) {
        topicContainer.innerHTML = `Welcome,<br>${name}`;
      } else {
        console.error('Error: Welcome_Employee_Name not found');
      }
    })
    .catch(error => {
      console.error('Error fetching employee name:', error);
    });
}

function fetchCategories(machineVariant) {
  const scriptUrl = `https://script.google.com/macros/s/AKfycbzOQpm-OTm8QeCplGrUmHKlavhf-noxyq1bAJffHJu45fmRKpaDEqqgF6FhDJNb1g82/exec?topic=${encodeURIComponent(machineVariant)}`;

  fetch(scriptUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const headers = data[0];
      const functionsColumnIndex = headers.indexOf('Functions');
      const categoryOfFunctionColumnIndex = headers.indexOf('Category of Function');
      const rows = data.slice(1); // Remove the header row from the data
      populateCategories(rows, functionsColumnIndex, categoryOfFunctionColumnIndex, machineVariant);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const container = document.getElementById('category-container');
      container.innerHTML = '<p>Failed to load categories</p>';
    });
}

function populateCategories(rows, functionsColumnIndex, categoryOfFunctionColumnIndex, machineVariant) {
  const container = document.getElementById('category-container');
  container.innerHTML = ''; // Clear existing items and loading text

  if (rows.length === 0) {
    container.innerHTML = '<p>No functions available</p>';
    return;
  }

  const categories = {};

  // Group functions by their categories
  rows.forEach(row => {
    const category = row[categoryOfFunctionColumnIndex];
    const functions = row[functionsColumnIndex];

    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(row);
  });

  // Display the categories and their functions
  Object.keys(categories).forEach(category => {
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = category;
    container.appendChild(categoryTitle);

    categories[category].forEach(row => {
      const functions = row[functionsColumnIndex];
      const div = document.createElement('div');
      div.className = 'category-item';
      div.textContent = functions;
      div.addEventListener('click', () => {
        const rowData = encodeURIComponent(JSON.stringify(row));
        const categoryName = encodeURIComponent(category); // Use the category name instead of functions
        window.location.href = `CONTENTS UPD/contents.html?category=${rowData}&topic=${encodeURIComponent(machineVariant)}&categoryName=${categoryName}`; // Pass category name as parameter
      });
      container.appendChild(div);
    });
  });
}
