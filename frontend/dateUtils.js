// Function to format the date as dd/mm/yy
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

// Function to get the current month name
export function getCurrentMonth() {
  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long" });
  return monthName;
}

// Function to get the dates for Monday to Friday of the current week
export function getWeekDates() {
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

// Function to get the day of the week (e.g., Monday, Tuesday)
export function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

// Function to get the present day and date
export function getPresentDayAndDate() {
  const today = new Date();
  const dateFormatted = formatDate(today);
  const dayOfWeek = getDayOfWeek(today);
  return { date: dateFormatted, day: dayOfWeek };
}