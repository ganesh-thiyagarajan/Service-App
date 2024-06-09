document.addEventListener('DOMContentLoaded', function() {
  const searchResults = JSON.parse(sessionStorage.getItem('searchResults'));
  populateSearchResults(searchResults);
});

function populateSearchResults(results) {
  const container = document.getElementById('search-results-container');
  container.innerHTML = ''; // Clear any existing content

  const loadingText = document.getElementById('loading-text');
  if (loadingText) {
    loadingText.style.display = 'none'; // Hide the loading text
  }

  if (results.length === 0) {
    container.innerHTML = '<p>No matching functions found</p>';
    return;
  }

  results.forEach(result => {
    const div = document.createElement('div');
    div.className = 'search-result-item';

    // Create and append elements for functions and machineVariant
    const functionsDiv = document.createElement('div');
    functionsDiv.className = 'functions';
    functionsDiv.textContent = result.functions;

    const machineVariantDiv = document.createElement('div');
    machineVariantDiv.className = 'machine-variant';
    machineVariantDiv.textContent = `Machine Variant: ${result.machineVariant}`;

    div.appendChild(functionsDiv);
    div.appendChild(machineVariantDiv);

    div.addEventListener('click', () => {
      // Handle result click event
      window.location.href = `CATEGORY UPD/category.html?topic=${encodeURIComponent(result.machineVariant)}`;
    });

    container.appendChild(div);
  });
}

function showErrorMessage(message) {
  const container = document.getElementById('search-results-container');
  container.innerHTML = `<p>${message}</p>`;
  const loadingText = document.getElementById('loading-text');
  if (loadingText) {
    loadingText.style.display = 'none'; // Hide the loading text
  }
}
