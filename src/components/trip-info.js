import {MONTHS} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const getTripCost = (card) => {
  const {price, options} = card;
  const tripCost = options.map((option) => option.price).reduce((sum, current) => {
    return sum + current;
  }, price);
  return tripCost;
};

const getRouteInfo = (cards) => {
  const cities = cards.map((card) => card.destination);

  switch (cities.length) {
    case 1:
    case 2:
      return cities[0] + ` &mdash; ` + cities[1];

    case 3:
      return cities[0] + cities[1] + cities[2];

    default:
      return cities[0] + ` &mdash; ... &mdash; ` + cities[cities.length - 1];
  }
};

const createTripInfoTemplate = (cards) => {
  const totalCost = cards.map((card) => getTripCost(card)).reduce((sum, current) => {
    return sum + current;
  });
  const route = getRouteInfo(cards);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${MONTHS[cards[0].startDate.getMonth()]} ${cards[0].startDate.getDate()}&nbsp;&mdash;&nbsp;${cards[cards.length - 1].endDate.getDate()}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createTripInfoTemplate(this._cards);
  }
}
