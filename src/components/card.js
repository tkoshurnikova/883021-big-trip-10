import {formatTime, formatDateForDatetime, getEventDuration, getEventTitle} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createOffersMarkup = (offers) => {
  return offers
    .map(({name, price}) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </li>`
      );
    })
    .join(`\n`);
};

const createCardTemplate = (card) => {
  const {type, destination, startDate, endDate, price, offers} = card;
  const offersMarkup = createOffersMarkup(offers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${getEventTitle(type)} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateForDatetime(startDate)}">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateForDatetime(endDate)}">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${getEventDuration(endDate, startDate)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
