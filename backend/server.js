const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const admin = require('./config/firebaseConfig'); // Import Firebase from firebaseConfig.js

// Initialize Express app
const app = express();

// Middleware
// CORS configuration
app.use(
  cors({
    origin: ['http://127.0.0.1:5500', 'https://a-hub-attendance-app.vercel.app'], // Replace with your frontend origin
    credentials: true, // Allow credentials (cookies)
  })
);

app.use(express.json()); // Parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Use routes
app.use('/', routes);

// Test Firestore connection on server startup
const firestore = admin.firestore();
firestore.collection('test').doc('testDoc').set({ message: 'Firestore is working!' })
  .then(() => console.log('Firestore connection successful!'))
  .catch((error) => {
    console.error('Firestore connection failed:', error);
    process.exit(1); // Exit the process if Firestore connection fails
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;