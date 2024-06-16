document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const employeeId = document.getElementById('employee-id').value;
  const password = document.getElementById('password').value;

  fetch('https://script.google.com/macros/s/AKfycbxJuCrll8BsCh73csHYwHHj6OovpGu4vyVoHnZgtY1v5qBP5s_cFLvmXJwv_8YIuVfY/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `employeeId=${encodeURIComponent(employeeId)}&password=${encodeURIComponent(password)}`,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('employeeId', employeeId);
        if (employeeId === '21005') {
          window.location.href = 'user-manage.html';
        } else {
          window.location.href = 'INDEX UPD/index.html';
        }
      } else {
        alert('Invalid credentials');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
