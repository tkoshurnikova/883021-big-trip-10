import {formatDateForDatetime, MONTHS, createElement} from '../utils.js';

const createDayListTemplate = (date, dayNumber) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${formatDateForDatetime(new Date(date))}">${MONTHS[new Date(date).getMonth()]} ${new Date(date).getDate()}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};

export default class DayList {
  constructor(date, dayNumber) {
    this._element = null;
    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayListTemplate(this._date, this._dayNumber);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
