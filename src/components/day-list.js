import {formatDateForDatetime, getMonth} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const dateInfo = (date, dayNumber) => {
  if (date !== ``) {
    return (
      `<span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${formatDateForDatetime(new Date(date))}">${getMonth(new Date(date))} ${new Date(date).getDate()}</time>`
    );
  } else {
    return (``);
  }
};

const createDayListTemplate = (date, dayNumber) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dateInfo(date, dayNumber)}
      </div>
      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class DayList extends AbstractComponent {
  constructor(date, dayNumber) {
    super();
    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayListTemplate(this._date, this._dayNumber);
  }
}
