import { formatDate, getCurrentMonth, getWeekDates } from './dateUtils.js';
import { API_BASE_URL } from './config.js';

const attendanceSection = document.querySelector('.attendance');
const closeSection = document.querySelector('.close');
const adminLogInBtn = document.querySelector('.admin-login-btn');
const adminLogInLink = document.querySelector('.logInLink');

adminLogInBtn.innerHTML = `ADMIN LOGIN&nbsp;&nbsp;<i class="fa-solid fa-user"></i>`;

async function handleDashboardNav() {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/api/auth/check-admin`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (result.success) {
      // User is an admin
      adminLogInBtn.innerHTML = `ADMIN DASHBOARD&nbsp;&nbsp;<i class="fa-solid fa-grip"></i>`;
      adminLogInLink.setAttribute('href', './dashboard/dashboard.html');
      console.log('user is an admin');
    } else {
      // User is not an admin
      adminLogInBtn.innerHTML = `ADMIN LOGIN&nbsp;&nbsp;<i class="fa-solid fa-user"></i>`;
      adminLogInLink.setAttribute('href', './login/admin_login.html');
      console.log('user is not an admin');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    adminLogInBtn.innerHTML = `ADMIN LOGIN&nbsp;&nbsp;<i class="fa-solid fa-user"></i>`;
    adminLogInLink.setAttribute('href', './login/admin_login.html');
  }
}

// Check admin status on page load
handleDashboardNav();

// Function to open the attendance section
function openAttendance(selectedDate, selectedDay) {
  document.querySelector('.present-month').textContent = getCurrentMonth();
  document.querySelector('.present-date').textContent = selectedDate;
  document.querySelector('.present-day').textContent = selectedDay;
  renderUsers(selectedDate);
  attendanceSection.classList.add('visible');
}

// Function to render the dates in the grid
function renderDates() {
  const cardContainer = document.getElementById('cardContainer');

  if (!cardContainer) {
    return;
  }

  const currentMonth = getCurrentMonth();
  const weekDates = getWeekDates();
  const today = new Date();
  const todayFormatted = formatDate(today);

  document.querySelector('.month').textContent = currentMonth;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  weekDates.forEach((date, index) => {
    // Create the card element
    const card = document.createElement('div');
    card.className = 'card';

    const dateFormatted = formatDate(date);
    if (dateFormatted === todayFormatted) {
      card.classList.add('active');
    }

    // Create the info div
    const info = document.createElement('div');
    info.className = 'info';

    // Create the day element
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.textContent = daysOfWeek[index];

    const dateElement = document.createElement('div');
    dateElement.className = 'date';
    dateElement.textContent = formatDate(date);

    // Append day and date to the info div
    info.appendChild(dayElement);
    info.appendChild(dateElement);

    // Create the icon element
    const icon = document.createElement('i');
    icon.className = 'fa fa-angle-right';

    // Append info and icon to the card
    card.appendChild(info);
    card.appendChild(icon);

    // Append the card to the container
    cardContainer.appendChild(card);

    card.addEventListener('click', () => {
      openAttendance(dateFormatted, daysOfWeek[index]), currentMonth;
    });

    closeSection.addEventListener('click', () => {
      attendanceSection.classList.remove('visible');
    });
  });
}

// Function to render users in the table
const renderUsers = async (selectedDate) => {
  const dateParts = selectedDate.split('/');
  const isoDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to ISO format
  const tableBody = document.querySelector('#usersTable tbody');
  tableBody.innerHTML = '';

  try {
    // Fetch users and attendance data from the backend
    const usersResponse = await fetch(`${API_BASE_URL}/api/users`);
    const usersData = await usersResponse.json(); // Rename to avoid confusion

    // Check if the response is successful and contains the users array
    if (!usersData.success || !Array.isArray(usersData.users)) {
      console.error('Invalid users data:', usersData);
      return;
    }

    const attendanceResponse = await fetch(`${API_BASE_URL}/api/attendance?date=${isoDate}`);
    const attendanceData = await attendanceResponse.json();

    // Validate attendance data
    if (!attendanceData.success || !Array.isArray(attendanceData.attendance)) {
      console.error('Invalid attendance data:', attendanceData);
      return;
    }

    const attendanceMap = {};
    attendanceData.attendance.forEach((record) => {
      attendanceMap[record.userId] = record.status;
    });

    // Render users in the table
    usersData.users.forEach((user) => {
      const row = document.createElement('tr');
      const attendanceStatus = attendanceMap[user.id] || 'Not Marked';

      let statusClass = '';
      if (attendanceStatus === 'Present') {
        statusClass = 'status-present';
      } else if (attendanceStatus === 'Absent') {
        statusClass = 'status-absent';
      } else {
        statusClass = 'status-not-marked';
      }

      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.program}</td>
        <td class="${statusClass}">${attendanceStatus}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error rendering users:', error);
  }
};

// Render dates on page load
window.addEventListener('load', () => {
  renderDates();
});