import {FilterType, getCardsByFilter} from '../utils/filter.js';

export default class Cards {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL;
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
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));
    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
