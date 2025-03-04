import { auth } from '../app.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

// synchronous
// asynchronous

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '../dashboard/dashboard.html'; // Redirect to dashboard
      console.log("welcome admin");
    } catch (error) {
      document.getElementById('error').textContent = 'wrong login credentials';
    };
  });
}