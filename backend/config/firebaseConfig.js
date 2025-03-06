const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.js'); // Path to your service account key

// Log Firebase initialization
console.log('Initializing Firebase Admin SDK...');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin SDK initialized successfully!');

module.exports = admin;