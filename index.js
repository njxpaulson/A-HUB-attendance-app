const attendanceSection = document.querySelector('.attendance');
const days = document.querySelectorAll('.card');
const closeSection = document.querySelector('.close');

// function openAttendance () {
//     attendanceSection.classList.add('visible');
// }

days.forEach(day => {
    day.addEventListener('click', () => {
        console.log('clicked');
        // openAttendance();
        attendanceSection.style.visibility = 'visible';
        attendanceSection.style.opacity = 1;
        attendanceSection.style.transform = 'scale(1)';
    });
});

closeSection.addEventListener('click', () => {
    attendanceSection.style.visibility = '';
    attendanceSection.style.opacity = '';
    attendanceSection.style.transform = '';
});