import { auth, db } from '../app.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

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
    
      // Update session data in Firestore
      const sessionData = {
        adminId: userCredential.user.uid,
        isLoggedIn: true,
        isAdmin: true,
      };
    
      await setDoc(doc(db, 'admin-sessions', userCredential.user.uid), sessionData).then(() => {
        window.location.href = '../dashboard/dashboard.html'; // Redirect to dashboard
      });    
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        document.getElementById('error').textContent = 'wrong login credentials';
      } else {
        document.getElementById('error').textContent = 'Error logging in';
        console.error('Error logging in:', error);
      }
    };       
  });
}