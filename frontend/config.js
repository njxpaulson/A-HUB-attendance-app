// config.js
const API_BASE_URL = window.location.hostname === '127.0.0.1' || 'localhost'
  ? 'http://localhost:3000' // Development
  : 'https://api.yourdomain.com'; // Production

export { API_BASE_URL };