import { auth, db } from './app.js';
import { doc, getDoc, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

const attendanceSection = document.querySelector('.attendance');
const closeSection = document.querySelector('.close');
const adminLogInBtn = document.querySelector('.admin-login-btn');
const adminLogInLink = document.querySelector('.logInLink');

async function handleDashboardNav() {
    const user = auth.currentUser;

    if (!adminLogInBtn) {
      return;
    } else {
      adminLogInBtn.innerHTML = '';
    }
    
  if (user) {
    const adminSessionRef = doc(db, 'admin-sessions', user.uid);
    const adminSessionSnap = await getDoc(adminSessionRef);

    if (adminSessionSnap.exists() && adminSessionSnap.data().isLoggedIn) {
      adminLogInBtn.innerHTML = `ADMIN DASHBOARD&nbsp;&nbsp;<i class="fa-solid fa-grip"></i>`;
      adminLogInLink.setAttribute('href', './dashboard/dashboard.html');
    } else {
      adminLogInBtn.innerHTML = `ADMIN LOGIN&nbsp;&nbsp;<i class="fa-solid fa-user"></i>`;
      adminLogInLink.setAttribute('href', './login/admin_login.html');
    }
  } else {
    adminLogInBtn.innerHTML = `ADMIN LOGIN&nbsp;&nbsp;<i class="fa-solid fa-user"></i>`;
    adminLogInLink.setAttribute('href', './login/admin_login.html');
  }
}

auth.onAuthStateChanged((user) => {
  handleDashboardNav();
});

// Function to format the date as dd/mm/yy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function getCurrentMonth() {
  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}

// Function to get the dates for Monday to Friday of the current week
function getWeekDates() {
  const today = new Date(); 
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);

  // Calculate the start of the week (Monday)
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const weekDates = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

function openAttendance(selectedDate, selectedDay) {
  // document.getElementById("selectedDate").textContent = selectedDate;
  document.querySelector('.present-month').textContent = getCurrentMonth();
  document.querySelector('.present-date').textContent = selectedDate;
  document.querySelector('.present-day').textContent = selectedDay;
  renderUsers(selectedDate);
  attendanceSection.classList.add('visible');
}

// Function to render the dates in the grid
function renderDates() {
  const cardContainer = document.getElementById("cardContainer");

  if (!cardContainer) {
    return;
  }

  const currentMonth = getCurrentMonth();
  const weekDates = getWeekDates();
  const today = new Date();
  const todayFormatted = formatDate(today);

  document.querySelector('.month').textContent = currentMonth;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  weekDates.forEach((date, index) => {
    // Create the card element
    const card = document.createElement("div");
    card.className = "card";

    const dateFormatted = formatDate(date);
    if (dateFormatted === todayFormatted) {
      card.classList.add("active");
    }

    // Create the info div
    const info = document.createElement("div");
    info.className = "info";

    // Create the day element
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = daysOfWeek[index];

    // document.querySelector('.present-day').innerHTML = 

    const dateElement = document.createElement("div");
    dateElement.className = "date";
    dateElement.textContent = formatDate(date);

    // Append day and date to the info div
    info.appendChild(dayElement);
    info.appendChild(dateElement);

    // Create the icon element
    const icon = document.createElement("i");
    icon.className = "fa fa-angle-right";

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

const renderUsers = async (selectedDate) => {
  const dateParts = selectedDate.split('/');
  const year = `20${dateParts[2]}`; // assume 21st century
  const isoDate = `${year}-${dateParts[1]}-${dateParts[0]}`;
  const tableBody = document.querySelector("#usersTable tbody");
  tableBody.innerHTML = "";

  const usersQuerySnapshot = await getDocs(collection(db, "users"));

  const attendanceRef = collection(db, "attendance");
  const today = new Date().toISOString().split("T")[0];
  const attendanceQuery = query(attendanceRef, where("date", "==", isoDate));
  const attendanceQuerySnapshot = await getDocs(attendanceQuery);

  const attendanceMap = {};
  attendanceQuerySnapshot.forEach((doc) => {
    attendanceMap[doc.data().userId] = doc.data().status;
  });

  usersQuerySnapshot.forEach((doc) => {
    const user = doc.data();
    const userId = doc.id;
    const attendanceStatus = attendanceMap[userId] || "Not Marked";

    const row = document.createElement("tr");

    let statusClass = "";
    if (attendanceStatus === "Present") {
      statusClass = "status-present";
    } else if (attendanceStatus === "Absent") {
      statusClass = "status-absent";
    } else {
      statusClass = "status-not-marked";
    }

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.program}</td>
      <td class="${statusClass}">${attendanceStatus}</td>
    `;

    tableBody.appendChild(row);
  });
};

window.addEventListener("load", () => {
  renderDates();
});

export { getCurrentMonth, formatDate };