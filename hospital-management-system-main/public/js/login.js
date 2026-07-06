const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

async function doLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    errorMsg.textContent = 'Please enter both email and password';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('hms_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.textContent = data.message || 'Login failed. Please try again.';
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    errorMsg.textContent = 'Could not connect to the server. Is it running?';
    errorMsg.style.display = 'block';
  }
}

loginBtn.addEventListener('click', doLogin);

document.getElementById('password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});

// Redirect if already logged in
if (localStorage.getItem('hms_user')) {
  window.location.href = 'dashboard.html';
}
