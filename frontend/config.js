// config.js
const API_BASE_URL = window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000' // Development
  : 'https://a-hub-attendance-app.onrender.com'; // Production

export { API_BASE_URL };