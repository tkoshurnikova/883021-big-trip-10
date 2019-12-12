const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;

  return `${day}/${month}/${year}`;
};

const randomChecked = () => {
  const check = (Math.random() > 0.5) ? `checked` : ``;
  return check;
}

export {formatTime, formatDate, randomChecked};
