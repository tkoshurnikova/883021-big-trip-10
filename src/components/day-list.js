import {formatDateForDatetime, MONTHS} from '../utils.js';
import AbstractComponent from './abstract-component.js';

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
