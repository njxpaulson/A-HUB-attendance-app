import { auth, db } from '../app.js';
import { getCurrentMonth, formatDate } from '../script.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, updateDoc, where, query } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

// Function to check if the user is an admin
async function checkIfAdmin() {
  const user = auth.currentUser;

  if (!user) {
    window.location.href = '../login/admin_login.html';
    return;
  }

  // Check Firestore for admin session
  const adminSessionRef = doc(db, 'admin-sessions', user.uid);
  const adminSessionSnap = await getDoc(adminSessionRef);

  if (!adminSessionSnap.exists() || !adminSessionSnap.data().isAdmin) {
    window.location.href = '../login/admin_login.html';
    return;
  }
}

// Run the check when the dashboard page loads
auth.onAuthStateChanged((user) => {
  if (user) {
    checkIfAdmin();
  } else {
    window.location.href = '../login/admin_login.html';
  }
});

function getDayOfWeek(date) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[date.getDay()];
}

// Function to get the present day and date
function getPresentDayAndDate() {
  const today = new Date();
  const dateFormatted = formatDate(today);
  const dayOfWeek = getDayOfWeek(today);
  
  return { date: dateFormatted, day: dayOfWeek };
}

function displayDate() {
  const presentDayAndDate = getPresentDayAndDate();
  
  document.querySelector('.month').textContent = getCurrentMonth();
  document.querySelector('.day').textContent = presentDayAndDate.day;
  document.querySelector('.date').textContent = presentDayAndDate.date;
}
displayDate();


  // Add User Form
  function toggleAddUserForm() {
    const addUserSection = document.querySelector(".add-user-form");
    const isVisible = addUserSection.classList.toggle("visible");
    const mask = document.querySelector(".mask");

    if (isVisible) {
      mask.style.display = "block";
    } else {
      mask.style.display = "none";
    }
  }

  document.querySelectorAll("#add-user, #cancel").forEach((button) => {
    button.addEventListener("click", toggleAddUserForm);
  });

  document
      .getElementById("addUserForm")
      .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const program = document.getElementById("program").value;

      const querySnapshot = await getDocs(collection(db, "users"));
      const existingUser = querySnapshot.docs.find(
        (doc) => doc.data().name === name && doc.data().program === program
      );

      if (existingUser) {
        alert("User already exists!");
        return;
      }

      try {
        await addDoc(collection(db, "users"), { name, program });
        renderUsers();
        e.target.reset();
        toggleAddUserForm();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    });

  // Render Users in Table
  const renderUsers = async () => {
    const tableBody = document.querySelector("#usersTable tbody");
    tableBody.innerHTML = "";

    const usersQuerySnapshot = await getDocs(collection(db, "users"));
    const attendanceRef = collection(db, "attendance");
    const today = new Date().toISOString().split("T")[0];
    const attendanceQuery = query(attendanceRef, where("date", "==", today));
    const attendanceQuerySnapshot = await getDocs(attendanceQuery);

    const attendanceMap = {};

    attendanceQuerySnapshot.forEach((doc) => {
      attendanceMap[doc.data().userId] = doc.data().status;
    });

    usersQuerySnapshot.forEach((doc) => {
      const user = doc.data();
      const row = document.createElement("tr");
      // const row = document.querySelector('.user-details');
      const userId = doc.id;
      const attendanceStatus = attendanceMap[userId] || "Not Marked";

      row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.program}</td>
          <td>
            <button class="mark-present-btn" data-user-id="${doc.id}">${
        attendanceStatus === "Present" ? "Present" : "Mark Present"
      }</button>
            <button class="mark-absent-btn" data-user-id="${doc.id}">${
        attendanceStatus === "Absent" ? "Absent" : "Mark Absent"
      }</button>
          </td>
          <td>
            <p>${attendanceStatus}</p>            
          </td>
          <td>
            <button class="delete-user-btn" data-user-id="${
              doc.id
            }">DELETE</button>
          </td>
        `;

      const presentButton = row.querySelector(".mark-present-btn");
      presentButton.addEventListener("click", () =>
        markAttendance(doc.id, "Present")
      );
      const absentButton = row.querySelector(".mark-absent-btn");
      absentButton.addEventListener("click", () =>
        markAttendance(doc.id, "Absent")
      );
      const deleteButton = row.querySelector(".delete-user-btn");
      deleteButton.addEventListener("click", () => deleteUser(doc.id));

      tableBody.appendChild(row);
    });
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      renderUsers();
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  window.markAttendance = async (userId, status) => {
    try {
      const attendanceRef = collection(db, "attendance");
      const today = new Date().toISOString().split("T")[0];
      const q = query(
        attendanceRef,
        where("userId", "==", userId),
        where("date", "==", today)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        await updateDoc(querySnapshot.docs[0].ref, { status });
      } else {
        await addDoc(attendanceRef, { userId, status, date: today });
      }

      alert("Attendance marked successfully");
      renderUsers();
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  // Initialize render
  renderUsers();

  async function logout() {
    const user = auth.currentUser;
  
    if (user) {
      try {
        const adminSessionRef = doc(db, 'admin-sessions', user.uid);
        await updateDoc(adminSessionRef, {
          isLoggedIn: false,
        });
  
        await signOut(auth);
  
        window.location.href = '../index.html';
      } catch (error) {
        console.error('Error logging out:', error);
        alert('An error occurred while logging out. Please try again.');
      }
    } else {
      console.log('No user is logged in');
      window.location.href = '../index.html';
    }
  }

  document.querySelector('.log-out-btn').addEventListener('click', async () => {
    await logout();
  });