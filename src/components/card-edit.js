import {EVENTS, DESTINATIONS, OPTIONS} from '../mock/card.js';
import {formateDateAndTime, uppercaseFirstLetter, getEventTitle} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const createEventTypeMarkup = (event) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${event}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event}">
      <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-1">${uppercaseFirstLetter(event)}</label>
    </div>`
  );
};

const createEventsFieldsetMarkup = (group) => {
  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group}</legend>
      ${group.map((element) => createEventTypeMarkup(element)).join(`\n`)}
    </fieldset>`
  );
};

const createOfferMarkup = (offer, card) => {
  const {options} = card;
  const check = (options.indexOf(offer) !== -1) ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${check}>
      <label class="event__offer-label" for="event-offer-${offer.type}-1">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createCardEditTemplate = (card, options = {}) => {
  const {photos, description, startDate, endDate, price, isFavorite} = card;
  const {type, destination} = options;
  const eventGroups = Object.keys(EVENTS);
  const events = eventGroups.map((group) => createEventsFieldsetMarkup(EVENTS[group])).join(`\n`);
  const offers = OPTIONS.map((option) => createOfferMarkup(option, card)).join(`\n`);
  const isChecked = isFavorite ? `checked` : ``;

  return (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${events}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getEventTitle(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
    ${DESTINATIONS.map((item) => {
      return (
        `<option value="${item.city}"></option>`
      );
    }).join(`\n`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formateDateAndTime(startDate)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formateDateAndTime(endDate)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isChecked}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
           ${offers}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
    ${photos.map((photo) => {
      return (
        `<img class="event__photo" src="${photo}" alt="Event photo">`
      );
    }).join(`\n`)}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class CardEdit extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._cardType = card.type;
    this._cardDestination = card.destination;

    this._subscribeOnEvents();

    this._rollUpButtonClickHandler = null;
    this._submitHandler = null;
    this._favoriteButtonHandler = null;
  }

  getTemplate() {
    return createCardEditTemplate(this._card, {
      type: this._cardType,
      destination: this._cardDestination
    });
  }

  setRollUpButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._rollUpButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavouriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  recoveryListeners() {
    this.setRollUpButtonClickHandler(this._rollUpButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setFavouriteButtonHandler(this._favoriteButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._cardType = evt.target.value;
        this.rerender();
      }
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      DESTINATIONS.forEach((destination) => {
        if (this._cardDestination === destination.city) {
          this._cardDestination = evt.target.value;
          this._card.description = destination.description;
          this.rerender();
        }
      });
    });
  }
}
