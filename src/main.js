import API from './api.js';
import CardsModel from './models/cards.js';
import FilterController from './controllers/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatsComponent from './components/stats.js';
import TripController from './controllers/trip.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic exIHB6SXOwYQ147`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const siteMainElement = document.querySelector(`.page-main`);
const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new SiteMenuComponent();
const statsComponent = new StatsComponent(cardsModel);
const cardsListSection = document.querySelector(`.trip-events`);

const tripContoller = new TripController(cardsListSection, cardsModel, destinationsModel, offersModel);
const filterController = new FilterController(siteHeaderElement, cardsModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
filterController.render();

render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripContoller.createCard();
});

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      tripContoller.hide();
      statsComponent.show();
      break;
    case MenuItem.TABLE:
      statsComponent.hide();
      tripContoller.show();
      break;
  }
});

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    tripContoller.render();
  });

api.getDestinations()
  .then((destinations) => {
    destinationsModel.setDestinations(destinations);
  });

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
  });
