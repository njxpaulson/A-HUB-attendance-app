// backend/controllers/attendanceController.js
const admin = require('../config/firebaseConfig');
const db = admin.firestore();

// Mark attendance for a user
exports.markAttendance = async (req, res) => {
  const { userId, status } = req.body;
  const today = new Date().toISOString().split('T')[0];

  try {
    const attendanceRef = db.collection('attendance');
    const q = attendanceRef
      .where('userId', '==', userId)
      .where('date', '==', today);

    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      // Update existing attendance record
      await querySnapshot.docs[0].ref.update({ status });
    } else {
      // Add new attendance record
      await attendanceRef.add({ userId, status, date: today });
    }

    res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking attendance', error });
  }
};

// Get attendance for a specific date
exports.getAttendance = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date parameter is required' });
  }

  console.log('Fetching attendance for date:', date);

  try {
    const attendanceQuerySnapshot = await db.collection('attendance')
      .where('date', '==', date)
      .get();

    const attendance = attendanceQuerySnapshot.docs.map(doc => doc.data());
    res.json({ success: true, attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance', error });
  }
};

console.log('i am attendance controller');