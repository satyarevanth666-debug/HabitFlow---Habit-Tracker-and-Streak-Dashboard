// Date utility functions for habit tracking

export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getDateString = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const getFormattedDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', options);
};

export const getDayOfWeek = (dateString) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateString + 'T00:00:00');
  return days[date.getDay()];
};

export const getPreviousDate = (dateString, daysBack = 1) => {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() - daysBack);
  return date.toISOString().split('T')[0];
};

export const getNextDate = (dateString, daysForward = 1) => {
  const date = new Date(dateString + 'T00:00:00');
  date.setDate(date.getDate() + daysForward);
  return date.toISOString().split('T')[0];
};

export const isDateEqual = (date1, date2) => {
  return getDateString(date1) === getDateString(date2);
};

export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const getLast30Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const getWeekNumber = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getMonthName = (dateString) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(dateString + 'T00:00:00');
  return months[date.getMonth()];
};

export const getYear = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.getFullYear();
};

export const isFutureDate = (dateString) => {
  const today = getTodayDate();
  return dateString > today;
};

export const isPastDate = (dateString) => {
  const today = getTodayDate();
  return dateString < today;
};

export const isToday = (dateString) => {
  return dateString === getTodayDate();
};

export const getDateRangeLabel = (startDate, endDate) => {
  const start = getFormattedDate(startDate);
  const end = getFormattedDate(endDate);
  return `${start} - ${end}`;
};
