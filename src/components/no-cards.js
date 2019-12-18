import {createElement} from '../utils.js';

const createNoCardsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoCards {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoCardsTemplate();
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
