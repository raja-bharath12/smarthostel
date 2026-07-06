/**
 * LoginController - handles the login page's form submission and
 * redirects to the dashboard on success.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorBox = document.getElementById('errorBox');
  const togglePw = document.getElementById('togglePw');
  const pwInput = document.getElementById('password');

  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const successBox = document.getElementById('successBox');
  const toggleRegPw = document.getElementById('toggleRegPw');
  const regPwInput = document.getElementById('regPassword');

  // Already logged in? Skip straight to the dashboard.
  if (ApiClient.isAuthenticated()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Tab switching logic
  tabLogin.addEventListener('click', () => {
    tabLogin.style.opacity = '1';
    tabRegister.style.opacity = '0.7';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    document.querySelector('h2').textContent = 'Sign in to your account';
    document.querySelector('.subtitle').textContent = 'Please enter your name and password to log in.';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.style.opacity = '1';
    tabLogin.style.opacity = '0.7';
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    document.querySelector('h2').textContent = 'Create an account';
    document.querySelector('.subtitle').textContent = 'Register with your email and username.';
  });

  togglePw.addEventListener('click', () => {
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
  });

  toggleRegPw.addEventListener('click', () => {
    regPwInput.type = regPwInput.type === 'password' ? 'text' : 'password';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const username = document.getElementById('username').value.trim();
    const password = pwInput.value;

    try {
      // Check localStorage for the registered user first (Mock backend)
      const storedUser = localStorage.getItem('demo_user_' + username);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.password === password) {
          // Simulate successful login
          ApiClient.setSession('demo-token-12345', { id: 999, username: username, role: 'student' });
          window.location.href = 'dashboard.html';
          return;
        } else {
          errorBox.textContent = 'Invalid credentials. Please try again.';
          errorBox.style.display = 'block';
          return;
        }
      }

      // If not in localStorage, try the real backend
      const result = await AuthService.login(username, password);

      if (!result.success) {
        errorBox.textContent = result.message || 'Login failed.';
        errorBox.style.display = 'block';
        return;
      }

      ApiClient.setSession(result.token, result.user);
      window.location.href = 'dashboard.html';
    } catch (err) {
      errorBox.textContent = 'Could not reach the server. Please try again.';
      errorBox.style.display = 'block';
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = regPwInput.value;

    try {
      // In a real app, you would call AuthService.register(email, username, password)
      // Since it's a demo without a real backend for register yet, we'll simulate success
      
      // Store the user locally to allow them to log in immediately
      localStorage.setItem('demo_user_' + username, JSON.stringify({
        email: email,
        username: username,
        password: password
      }));

      successBox.textContent = 'Registration successful! Please login.';
      successBox.style.display = 'block';
      
      // Auto-fill the login form with the newly registered credentials
      document.getElementById('username').value = username;
      pwInput.value = password;
      
      registerForm.reset();
      
      // Auto-switch back to login after short delay
      setTimeout(() => {
        tabLogin.click();
      }, 1500);
    } catch (err) {
      errorBox.textContent = 'Could not reach the server. Please try again.';
      errorBox.style.display = 'block';
    }
  });
});
