document.addEventListener('DOMContentLoaded', function() {

    fetchTopics();
    document.getElementById('search-form').addEventListener('submit', searchCategories);
  });
  
  function fetchTopics() {
    showLoadingText();
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxlwPLo92w4wLXozn7BKHq3d69WXfEdH14d74OKds2JO_0lIMT4r5P4oEn3Ccd_vvi0/exec';
  
    fetch(scriptUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        populateBentoMenu(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        const container = document.getElementById('bento-container');
        container.innerHTML = '<p>Failed to load topics</p>';
      });
  }
  
  function showLoadingText() {
    const container = document.getElementById('bento-container');
    container.innerHTML = '<p id="loading-text">Loading...</p>';
  }
  
  function populateBentoMenu(machineVariants) {
    const container = document.getElementById('bento-container');
    container.innerHTML = ''; // Clear existing items and loading text
  
    if (machineVariants.length === 0) {
      container.innerHTML = '<p>No machine variants available</p>';
      return;
    }
  
    machineVariants.forEach(machineVariant => {
      const div = document.createElement('div');
      div.className = 'bento-item';
      div.textContent = machineVariant;
      div.addEventListener('click', () => {
        window.location.href = `category.html?topic=${encodeURIComponent(machineVariant)}`;
      });
      container.appendChild(div);
    });
  }
  
  function searchCategories(event) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    if (!searchInput) return;
  
    fetch('https://script.google.com/macros/s/AKfycbxlwPLo92w4wLXozn7BKHq3d69WXfEdH14d74OKds2JO_0lIMT4r5P4oEn3Ccd_vvi0/exec?search=' + encodeURIComponent(searchInput))
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('searchResults', JSON.stringify(data));
        window.location.href = 'search.html';
      })
      .catch(error => console.error('Error searching categories:', error));
  }
  