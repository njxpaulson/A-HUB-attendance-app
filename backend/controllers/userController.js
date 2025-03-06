// backend/controllers/userController.js
const admin = require('../config/firebaseConfig');
const db = admin.firestore();

// Add a new user
exports.addUser = async (req, res) => {
  const { name, program } = req.body;

  try {
    // Check if the user already exists
    const usersQuerySnapshot = await db.collection('users')
      .where('name', '==', name)
      .where('program', '==', program)
      .get();

    if (!usersQuerySnapshot.empty) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Add the user to Firestore
    const docRef = await db.collection('users').add({ name, program });
    res.json({ success: true, message: 'User added successfully', userId: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding user', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.collection('users').doc(userId).delete();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const usersQuerySnapshot = await db.collection('users').get();
    const users = usersQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error });
  }
};

console.log('i am user controller');