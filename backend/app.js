const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const admin = require('./config/firebaseConfig'); // Import Firebase from firebaseConfig.js

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes (we'll add these later)
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Use routes
app.use('/', routes);

// Add this after initializing Firebase
const firestore = admin.firestore();

// Test Firestore connection
firestore.collection('test').doc('testDoc').set({ message: 'Firestore is working!' })
  .then(() => console.log('Firestore connection successful!'))
  .catch((error) => console.error('Firestore connection failed:', error));

// Export the app
module.exports = app;