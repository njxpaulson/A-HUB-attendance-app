// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDEoiT1MV0ZWdx1nVFOxTuM2Z4FNzsgvvM",
  authDomain: "a-hub-attendance-app.firebaseapp.com",
  projectId: "a-hub-attendance-app",
  storageBucket: "a-hub-attendance-app.firebasestorage.app",
  messagingSenderId: "324217019319",
  appId: "1:324217019319:web:0d4d7b3f7a8de0afaba632",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // authenticated
const db = getFirestore(app);

export { auth, db};