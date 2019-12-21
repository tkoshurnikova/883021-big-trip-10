import {formatTime, formatDateForDatetime} from '../utils/common.js';
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
  const {type, destination, startDate, endDate, price, options} = card;
  const offers = createOffersMarkup(options);

  const eventDuration = () => {
    const durationInMs = endDate - startDate;
    let hours = Math.floor(durationInMs / 3600000);
    let minutes = Math.floor((durationInMs % 3600000) / 60000);
    minutes = (minutes > 0) ? minutes : minutes + 60;
    return `${hours}H ${minutes}M`;
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${type.icon}" alt="Event type icon">
        </div>
        <h3 class="event__title">${type.name} in ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateForDatetime(startDate)}">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateForDatetime(endDate)}">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${eventDuration()}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers}
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
