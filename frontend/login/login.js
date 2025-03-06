import { API_BASE_URL } from '../config.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Send email and password to the backend for authentication
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Send email and password
      });

      const result = await response.json();

      if (result.success) {
        // Store the token in localStorage
        localStorage.setItem('token', result.token);

        // Redirect to the dashboard on successful login
        window.location.href = '../dashboard/dashboard.html';
      } else {
        // Display error message
        document.getElementById('error').textContent = result.message || 'Login failed';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      console.error('Error response:', error.response);
    
      document.getElementById('error').textContent = 'Error logging in';
    }
  });
}