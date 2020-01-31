export default class Offers {
  constructor() {
    this._offers = [];
  }

  getOffers() {
    return this._offers;
  }

  setOffers(data) {
    this._offers = data;
  }
}
