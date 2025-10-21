// frontend\src\utils\getRelativeTimeFromDate.js

export function getRelativeTimeFromDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
  
    if (diff < 60) return 'a few seconds ago';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day(s) ago`;
    return `${Math.floor(diff / 604800)} week(s) ago`;
  }
  