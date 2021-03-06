import {EVENTS} from '../utils/common.js';
import {formateDateAndTime, uppercaseFirstLetter, getEventTitle} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {Mode as PointControllerMode} from '../controllers/point.js';
import CardModel from '../models/card.js';
import flatpickr from 'flatpickr';
import moment from 'moment';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`
};

const createEventTypeMarkup = (event, type) => {
  const isChecked = (type === event) ? `checked` : ``;

  return (
    `<div class="event__type-item">
      <input id="event-type-${event}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event}" ${isChecked}>
      <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-1">${uppercaseFirstLetter(event)}</label>
    </div>`
  );
};

const createEventsFieldsetMarkup = (group, type) => {
  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group}</legend>
      ${group.map((element) => createEventTypeMarkup(element, type)).join(`\n`)}
    </fieldset>`
  );
};

const createOfferMarkup = (offer, offers, type, index) => {
  const isChecked = offers.findIndex((item) => {
    return item.title === offer.title;
  });
  const check = (isChecked === -1) ? `` : `checked`;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${check}>
      <label class="event__offer-label" for="event-offer-${type}-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createCardEditTemplate = (card, options = {}, mode, destinations, allOffers) => {
  const {photos, description} = card;
  const {type, destination, startDate, endDate, price, offers, isFavorite, externalData} = options;
  const eventGroups = Object.keys(EVENTS);
  const events = eventGroups.map((group) => createEventsFieldsetMarkup(EVENTS[group], type)).join(`\n`);
  const offersByType = allOffers.getOffers().filter((item) => item.type === type).map((item) => item.offers);
  const offersMarkup = offersByType.map((offersArray) => offersArray.map((offer, index) => createOfferMarkup(offer, offers, type, index)).join(`\n`));
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" required>
          <datalist id="destination-list-1">
    ${destinations.getDestinationNames().map((item) => {
      return (
        `<option value="${item}"></option>`
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

        ${mode === PointControllerMode.ADDING ? `` :

      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isChecked}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`
    }
      </header>

      ${(destination === `` && mode === PointControllerMode.ADDING) ? `` :

      `<section class="event__details">

        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
           ${offersMarkup}
          </div>
        </section>


        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
    ${photos.map((photo) => {
      return (
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
      );
    }).join(`\n`)}
            </div>
          </div>
        </section>
      </section>`
    }
    </form>`
  );
};

export default class CardEdit extends AbstractSmartComponent {
  constructor(card, mode, destinations, offers) {
    super();
    this._card = card;
    this._mode = mode;
    this._destinations = destinations;
    this._offers = offers;

    this._cardType = card.type;
    this._cardDestination = card.destination;
    this._cardIsFavorite = card.isFavorite;
    this._cardOffers = card.offers;
    this._cardPrice = card.price;
    this._cardStartDate = card.startDate;
    this._cardEndDate = card.endDate;
    this._externalData = DefaultData;

    this._flatpickr = null;
    this._applyFlatpickr();

    this._subscribeOnEvents();

    this._rollUpButtonClickHandler = null;
    this._submitHandler = null;
    this._favoriteButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return createCardEditTemplate(this._card, {
      type: this._cardType,
      destination: this._cardDestination,
      startDate: this._cardStartDate,
      endDate: this._cardEndDate,
      price: this._cardPrice,
      offers: this._cardOffers,
      isFavorite: this._cardIsFavorite,
      externalData: this._externalData
    }, this._mode, this._destinations, this._offers);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);

    const offersChecked = Array.from(form.querySelectorAll(`.event__offer-checkbox`))
      .filter((input) => input.checked)
      .map((input) => {
        return {
          title: input.parentElement.querySelector(`.event__offer-title`).textContent,
          price: parseInt(input.parentElement.querySelector(`.event__offer-price`).textContent, 10)
        };
      });

    const destination = {
      name: formData.get(`event-destination`),
      description: form.querySelector(`.event__destination-description`).textContent,
      pictures: Array.from(form.querySelectorAll(`.event__photo`)).map((photo) => {
        return {src: photo.src, description: photo.alt};
      })
    };

    return new CardModel({
      'type': formData.get(`event-type`),
      'destination': destination,
      'date_from': moment(formData.get(`event-start-time`), `DD/MM/YY HH:mm`).valueOf(),
      'date_to': moment(formData.get(`event-end-time`), `DD/MM/YY HH:mm`).valueOf(),
      'base_price': parseInt(formData.get(`event-price`), 10),
      'offers': offersChecked,
      'is_favorite': form.querySelector(`.event__favorite-checkbox`) ? form.querySelector(`.event__favorite-checkbox`).checked : false
    });
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setRollUpButtonClickHandler(handler) {
    if (this._mode !== PointControllerMode.ADDING) {
      this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
      this._rollUpButtonClickHandler = handler;
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (this._mode !== PointControllerMode.ADDING) {
      this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
      this._favoriteButtonHandler = handler;
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  recoveryListeners() {
    this.setRollUpButtonClickHandler(this._rollUpButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  blockElement() {
    const form = this.getElement();
    form.classList.add(`event--disabled`);
    form.querySelectorAll(`input`).forEach((input) => (input.disabled = true));
    form.querySelectorAll(`button`).forEach((button) => (button.disabled = true));
  }

  _applyFlatpickr() {

    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const startDateElement = this.getElement().querySelector(`#event-start-time-1`);
    this._setFlatpickrForStartDate(startDateElement, this._cardStartDate);

    const endDateElement = this.getElement().querySelector(`#event-end-time-1`);
    this._setFlatpickrForEndDate(endDateElement, this._cardEndDate, this._cardStartDate);
  }

  _setFlatpickrForStartDate(input, defaultDate) {
    this._flatpickr = flatpickr(input, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate,
    });
  }

  _setFlatpickrForEndDate(input, defaultDate, minDate) {
    this._flatpickr = flatpickr(input, {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate,
      minDate,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    if (this._mode !== PointControllerMode.ADDING) {
      element.querySelector(`.event__favorite-checkbox`).addEventListener(`change`, (evt) => {
        this._cardIsFavorite = evt.target.checked;
        this.rerender();
      });
    }

    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._cardType = evt.target.value;
        this.rerender();
      }
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._cardPrice = evt.target.value;
      this.rerender();
    });

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      this._cardStartDate = evt.target.value;
      this.rerender();
    });

    element.querySelector(`#event-end-time-1`).addEventListener(`change`, (evt) => {
      this._cardEndDate = evt.target.value;
      this.rerender();
    });

    if (this._mode !== PointControllerMode.ADDING) {
      element.querySelector(`.event__available-offers`).addEventListener(`change`, () => {
        this._cardOffers = Array.from(element.querySelectorAll(`.event__offer-checkbox`))
        .filter((input) => input.checked)
        .map((input) => {
          return {
            title: input.parentElement.querySelector(`.event__offer-title`).textContent,
            price: parseInt(input.parentElement.querySelector(`.event__offer-price`).textContent, 10)
          };
        });
      });
    }

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._destinations.getDestinations().forEach((destination) => {
        if (evt.target.value === destination.name) {
          this._cardDestination = evt.target.value;
          this._card.description = destination.description;
          this.rerender();
        }
      });
    });
  }
}
