import {formatDateForDatetime, MONTHS} from '../utils.js';
import {createCardTemplate} from './card.js';

const createDayListMarkup = (date, cards) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${new Date(date).getDate()}</span>
        <time class="day__date" datetime="${formatDateForDatetime(new Date(date))}">${MONTHS[new Date(date).getMonth()]} ${new Date(date).getFullYear() % 100}</time>
      </div>
      <ul class="trip-events__list">
      ${cards.slice(1).filter((card) => card.startDate.getDate() === new Date(date).getDate()).map((card) => createCardTemplate(card)).join(`\n`)}
      </ul>
    </li>`
  );
};

export const createDayListTemplate = (cards) => {
  const startDates = cards.slice(1).map((card) => card.startDate.toDateString());
  const uniqueDates = Array.from(new Set(startDates)).sort((a, b) => {
    return new Date(a) - new Date(b);
  });
  const days = uniqueDates.map((date) => createDayListMarkup(date, cards));
  return (
    `${days}`
  );
};
