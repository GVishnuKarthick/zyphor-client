export const timeAgo = (dateString) => {

  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

  const intervals = {
    y: 31536000,
    mo: 2592000,
    d: 86400,
    h: 3600,
    m: 60
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value}${key} ago`;
    }
  }

  return "just now";
};
