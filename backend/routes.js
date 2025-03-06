const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const attendanceController = require('./controllers/attendanceController');

// Logging middleware
router.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Authentication routes
router.post('/api/auth/login', authController.login); // Handle user login
router.get('/api/auth/check-admin', authController.checkIfAdmin);
router.post('/api/auth/logout', authController.logout); // Handle user logout

// User management routes
router.post('/api/users', userController.addUser); // Add a new user
router.delete('/api/users/:userId', userController.deleteUser); // Delete a user
router.get('/api/users', userController.getUsers); // Get all users

// Attendance routes
router.post('/api/attendance', attendanceController.markAttendance); // Mark attendance
router.get('/api/attendance', attendanceController.getAttendance); // Get attendance data

module.exports = router;