import {FilterType, getCardsByFilter} from '../utils/filter.js';

export default class Cards {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getCardsAll() {
    return this._cards;
  }

  getCards() {
    return getCardsByFilter(this._cards, this._activeFilterType);
  }

  setCards(cards) {
    this._cards = Array.from(cards);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  addCard(card) {
    this._cards = [].concat(card, this._cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  removeCard(id) {
    const index = this._cards.findIndex((card) => card.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), this._cards.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
