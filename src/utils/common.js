import moment from 'moment';
import {EVENTS} from '../mock/card.js';

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD-MM-YY`);
};

const formateDateAndTime = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const formatDateForDatetime = (date) => {
  return moment(date, moment.HTML5_FMT.DATETIME_LOCAL);
};

const getEventDuration = (endDate, startDate) => {
  const a = moment(endDate);
  const b = moment(startDate);

  const days = (a.diff(b, `days`) > 0) ? `${a.diff(b, `days`)}D` : ``;
  const hours = (a.diff(b, `hours`) > 0) ? `${a.diff(b, `hours`) % 24}H` : ``;
  const minutes = `${(a.diff(b, `minutes`) % 1440) % 60}M`;

  return `${days} ${hours} ${minutes}`;
};

const getMonth = (date) => {
  return moment(date).format(`MMM`);
};

const uppercaseFirstLetter = (element) => {
  return element[0].toUpperCase() + element.slice(1);
};

const getEventTitle = (type) => {
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

export {getMonth, formatTime, formatDate, formateDateAndTime, formatDateForDatetime, getEventDuration, uppercaseFirstLetter, getEventTitle};

