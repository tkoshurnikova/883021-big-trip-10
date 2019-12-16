import {formatDateForDatetime, MONTHS, createElement} from '../utils.js';

const createDayListMarkup = (cards, date, dates) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dates.indexOf(date) + 1}</span>
        <time class="day__date" datetime="${formatDateForDatetime(new Date(date))}">${MONTHS[new Date(date).getMonth()]} ${new Date(date).getDate()}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`
  );
};

const createDayListTemplate = (cards, uniqueDate, uniqueDates) => {
  return (
    `${createDayListMarkup(cards, uniqueDate, uniqueDates)}`
  );
};

export default class DayList {
  constructor(cards, uniqueDate, uniqueDates) {
    this._element = null;
    this._cards = cards;
    this._uniqueDate = uniqueDate;
    this._uniqueDates = uniqueDates;
  }

  getTemplate() {
    return createDayListTemplate(this._cards, this._uniqueDate, this._uniqueDates);
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
