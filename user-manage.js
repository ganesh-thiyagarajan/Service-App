document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.bento-item').forEach(item => {
      item.addEventListener('click', () => {
        const textContent = item.querySelector('p').textContent;
        if (textContent === 'Troubleshoot Guide') {
          window.location.href = 'INDEX UPD/index.html'; // Change to the actual path of your index page
        } else if (textContent === 'View Request') {
          window.location.href = 'REQUEST/requests.html'; // Change to the actual path of your request page
        } else {
          alert(`You clicked on ${textContent}`);
        }
      });
    });
  });
  