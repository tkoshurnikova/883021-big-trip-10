import CardsModel from './models/cards.js';

import FilterController from './controllers/filter.js';
import SiteMenuComponent from './components/site-menu.js';

import TripController from './controllers/trip.js';

import {generateCards} from './mock/card.js';
import {render, RenderPosition} from './utils/render.js';


const CARDS_COUNT = 4;

const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const cardsListSection = document.querySelector(`.trip-events`);
const cards = generateCards(CARDS_COUNT);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const filterController = new FilterController(siteHeaderElement, cardsModel);
filterController.render();

const tripContoller = new TripController(cardsListSection, cardsModel);
tripContoller.render();
