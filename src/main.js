import CardsModel from './models/cards.js';

import FilterController from './controllers/filter.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatsComponent from './components/stats.js';

import TripController from './controllers/trip.js';

import {generateCards} from './mock/card.js';
import {render, RenderPosition} from './utils/render.js';

const CARDS_COUNT = 4;

const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
const siteMenuComponent = new SiteMenuComponent();
document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripContoller.createCard();
});
render(siteHeaderElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const cardsListSection = document.querySelector(`.trip-events`);
const cards = generateCards(CARDS_COUNT);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const filterController = new FilterController(siteHeaderElement, cardsModel);
filterController.render();

const tripContoller = new TripController(cardsListSection, cardsModel);
tripContoller.render();

const siteMainElement = document.querySelector(`.page-main`);
const statsComponent = new StatsComponent(cardsModel.getCardsAll());
render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();

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
