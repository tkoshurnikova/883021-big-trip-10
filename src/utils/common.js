import moment from 'moment';

export const EVENTS = {
  TRANSFER: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  ACTIVITY: [`check-in`, `restaurant`, `sightseeing`]
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD-MM-YY`);
};

export const formateDateAndTime = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

export const formatDateForDatetime = (date) => {
  return moment(date, moment.HTML5_FMT.DATETIME_LOCAL);
};

export const getEventDuration = (endDate, startDate) => {
  const a = moment(endDate);
  const b = moment(startDate);

  const days = (a.diff(b, `days`) > 0) ? `${a.diff(b, `days`)}D` : ``;
  const hours = (a.diff(b, `hours`) > 0) ? `${a.diff(b, `hours`) % 24}H` : ``;
  const minutes = `${(a.diff(b, `minutes`) % 1440) % 60}M`;

  return `${days} ${hours} ${minutes}`;
};

export const getMonth = (date) => {
  return moment(date).format(`MMM`);
};

export const uppercaseFirstLetter = (element) => {
  return element[0].toUpperCase() + element.slice(1);
};

export const getEventTitle = (type) => {
  let eventTitle;
  if (EVENTS.ACTIVITY.indexOf(type) !== -1) {
    eventTitle = uppercaseFirstLetter(type) + ` in `;
  } else if (EVENTS.TRANSFER.indexOf(type) !== -1) {
    eventTitle = uppercaseFirstLetter(type) + ` to `;
  } else if (type === `trip`) {
    eventTitle = ``;
  }
  return eventTitle;
};
