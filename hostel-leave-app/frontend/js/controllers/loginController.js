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

      // Secret Admin Login Check
      if (username === '1210BHARATH' && password === 'Bharath@1210') {
        ApiClient.setSession('admin-mock-token-1210', { id: 'admin_1210', username: '1210Bharath', role: 'admin' });
        window.location.href = 'admin.html';
        return;
      }

      if (!window.firebaseAPI) {
        throw new Error("Firebase SDK is not loaded yet. Please try again in a moment.");
      }

      // We need to find the user's email since Firebase Auth uses email
      const usersRef = window.firebaseAPI.collection(window.firebaseDb, "users");
      const q = window.firebaseAPI.query(usersRef, window.firebaseAPI.where("username", "==", username));
      const querySnapshot = await window.firebaseAPI.getDocs(q);

      if (querySnapshot.empty) {
        errorBox.textContent = 'Invalid credentials. User not found.';
        errorBox.style.display = 'block';
        return;
      }

      // Get the email from the matched user document
      let emailToLogin = '';
      querySnapshot.forEach((doc) => {
        emailToLogin = doc.data().email;
      });

      // Now authenticate with Firebase using the retrieved email
      const userCredential = await window.firebaseAPI.signInWithEmailAndPassword(
        window.firebaseAuth, 
        emailToLogin, 
        password
      );

      // Simulate the session setup that the app expects
      ApiClient.setSession(userCredential.user.accessToken, { id: userCredential.user.uid, username: username, role: 'student' });
      window.location.href = 'dashboard.html';

    } catch (err) {
      console.error(err);
      errorBox.textContent = err.message || 'Login failed. Please check your credentials.';
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
      if (!window.firebaseAPI) {
        throw new Error("Firebase SDK is not loaded yet. Please try again in a moment.");
      }

      // Check if username already exists
      const usersRef = window.firebaseAPI.collection(window.firebaseDb, "users");
      const q = window.firebaseAPI.query(usersRef, window.firebaseAPI.where("username", "==", username));
      const querySnapshot = await window.firebaseAPI.getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error("Username already taken. Please choose another.");
      }

      // 1. Create the user in Firebase Auth
      const userCredential = await window.firebaseAPI.createUserWithEmailAndPassword(
        window.firebaseAuth, 
        email, 
        password
      );
      const user = userCredential.user;

      // 2. Save the username in Firestore database
      await window.firebaseAPI.setDoc(window.firebaseAPI.doc(window.firebaseDb, "users", user.uid), {
        email: email,
        username: username,
        createdAt: new Date().toISOString()
      });

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
      console.error(err);
      errorBox.textContent = err.message || 'Registration failed. Please try again.';
      errorBox.style.display = 'block';
    }
  });
});
