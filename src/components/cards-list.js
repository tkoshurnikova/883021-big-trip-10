import {createElement} from '../utils.js';

const createCardsListTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class CardsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardsListTemplate();
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
