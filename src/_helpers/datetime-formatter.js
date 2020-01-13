export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDate(date) {
  if (typeof date === 'number') {
    return date;
  }
  const parsed = Date.parse(date);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
}

export function pad(n) {
  return n < 10 ? '0' + n : n;
}

export function formatDate(date, seperator = '-') {
  date = new Date(parseDate(date));
  return pad(date.getDate()) + seperator + months[date.getMonth()] + seperator + date.getFullYear();
}

export function formatTime(date, seconds = false) {
  date = new Date(parseDate(date));
  var hh = date.getHours();
  var mm = pad(date.getMinutes());
  var ss = pad(date.getSeconds());
  var i = 'AM';

  if (hh > 12) {
    i = 'PM';
    hh = hh-12;
  }

  if (hh < 10) {
    hh = pad(hh);
  }

  return seconds ? `${hh}:${mm}:${ss} ${i}` : `${hh}:${mm} ${i}`;
}
