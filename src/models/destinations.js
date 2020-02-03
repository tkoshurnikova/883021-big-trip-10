export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationNames() {
    return Array.from(new Set(this._destinations.map(({name}) => name)));
  }

  setDestinations(data) {
    this._destinations = data;
  }
}
