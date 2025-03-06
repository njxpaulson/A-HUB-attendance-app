import { getCurrentMonth, getPresentDayAndDate } from '../dateUtils.js';
import { API_BASE_URL } from '../config.js';

// Function to check if the user is an admin
async function checkIfAdmin() {
  const token = localStorage.getItem('token'); // Assuming you store the token after login

  if (!token) {
    window.location.href = '../login/admin_login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/check-admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      window.location.href = '../login/admin_login.html';
      return;
    }

    const data = await response.json();

    if (!data.success) {
      window.location.href = '../login/admin_login.html';
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    window.location.href = '../login/admin_login.html';
  }
}

// Run the check when the dashboard page loads
document.addEventListener('DOMContentLoaded', () => {
  checkIfAdmin();
  displayDate();
  renderUsers();
});

// Function to display the current date and day
function displayDate() {
  const presentDayAndDate = getPresentDayAndDate();
  document.querySelector('.month').textContent = getCurrentMonth();
  document.querySelector('.day').textContent = presentDayAndDate.day;
  document.querySelector('.date').textContent = presentDayAndDate.date;
}

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

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, program }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const data = await response.json();
      if (data.success) {
        renderUsers();
        e.target.reset();
        toggleAddUserForm();
      } else {
        alert("User already exists!");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });

// Render Users in Table
const renderUsers = async () => {
  const tableBody = document.querySelector("#usersTable tbody");
  tableBody.innerHTML = "";

  try {
    // Fetch users
    const usersResponse = await fetch(`${API_BASE_URL}/api/users`);
    const usersData = await usersResponse.json();
    const users = usersData.users;

    // Fetch attendance for today's date
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const attendanceResponse = await fetch(`${API_BASE_URL}/api/attendance?date=${today}`);
    const attendanceData = await attendanceResponse.json();

    if (!attendanceData || !attendanceData.attendance) {
      console.error('Invalid attendance data:', attendanceData);
      return;
    }

    const attendanceMap = {};
    attendanceData.attendance.forEach(record => {
      attendanceMap[record.userId] = record.status;
    });

    // Render users and attendance status
    users.forEach(user => {
      const row = document.createElement("tr");
      const attendanceStatus = attendanceMap[user.id] || "Not Marked";

      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.program}</td>
        <td>
          <button class="mark-present-btn" data-user-id="${user.id}">${
            attendanceStatus === "Present" ? "Present" : "Mark Present"
          }</button>
          <button class="mark-absent-btn" data-user-id="${user.id}">${
            attendanceStatus === "Absent" ? "Absent" : "Mark Absent"
          }</button>
        </td>
        <td>
          <p>${attendanceStatus}</p>            
        </td>
        <td>
          <button class="delete-user-btn" data-user-id="${user.id}">DELETE</button>
        </td>
      `;

      const presentButton = row.querySelector(".mark-present-btn");
      presentButton.addEventListener("click", () =>
        markAttendance(user.id, "Present")
      );
      const absentButton = row.querySelector(".mark-absent-btn");
      absentButton.addEventListener("click", () =>
        markAttendance(user.id, "Absent")
      );
      const deleteButton = row.querySelector(".delete-user-btn");
      deleteButton.addEventListener("click", () => deleteUser(user.id));

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users or attendance:", error);
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    renderUsers();
    alert("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

window.markAttendance = async (userId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark attendance');
    }

    alert("Attendance marked successfully");
    renderUsers();
  } catch (error) {
    console.error("Error marking attendance:", error);
  }
};

// Logout Functionality
async function logout() {
  try {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Call the backend logout endpoint to update the session
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }

    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    window.location.href = '../index.html';
  } catch (error) {
    console.error('Error logging out:', error);
    alert('An error occurred while logging out. Please try again.');
  }
}

// Attach the logout function to the logout button
document.querySelector('.log-out-btn').addEventListener('click', async () => {
  await logout();
});