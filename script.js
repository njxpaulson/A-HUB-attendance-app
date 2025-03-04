const attendanceSection = document.querySelector('.attendance');
const days = document.querySelectorAll('.card');
const closeSection = document.querySelector('.close');
const adminLogInBtn = document.querySelector('.admin-login-btn');
const adminLogInLink = document.querySelector('.logInLink');

adminLogInBtn.textContent = '';

function handleDashboardNav() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        adminLogInBtn.textContent = 'ADMIN DASHBOARD';
        adminLogInLink.setAttribute('href', './dashboard/dashboard.html');
    } else {
        adminLogInBtn.textContent = 'ADMIN LOGIN';
        adminLogInLink.setAttribute('href', './login/admin_login.html');
    }
}

handleDashboardNav();

function openAttendance () {
    attendanceSection.classList.add('visible');
}

days.forEach(day => {
    day.addEventListener('click', () => {
        console.log('clicked');
        openAttendance();
    });
});

closeSection.addEventListener('click', () => {
    attendanceSection.classList.remove('visible');
});