import FilterComponent from './components/filter.js';
import SiteMenuComponent from './components/site-menu.js';

import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';

const CARDS_COUNT = 4;

const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const filters = generateFilters();
render(siteHeaderElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const cardsListSection = document.querySelector(`.trip-events`);
const cards = generateCards(CARDS_COUNT);

const tripContoller = new TripController(cardsListSection);
tripContoller.renderCards(cards);
