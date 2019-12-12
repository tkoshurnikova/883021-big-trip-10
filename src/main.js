import {createCardEditTemplate} from './components/card-edit.js';
import {createCardsListTemplate} from './components/cards-list.js';
import {createDayListTemplate} from './components/day-list.js';
import {createFilterTemplate} from './components/filter.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createSortTemplate} from './components/sort.js';
import {createTripInfoTemplate} from './components/trip-info.js';

import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';

const CARDS_COUNT = 4;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
const siteHeaderFirstHeadingElement = siteHeaderElement.querySelector(`h2`);
render(siteHeaderFirstHeadingElement, createSiteMenuTemplate(), `afterend`);

const filters = generateFilters();
render(siteHeaderElement, createFilterTemplate(filters), `beforeend`);

const cardsListSection = document.querySelector(`.trip-events`);
render(cardsListSection, createSortTemplate(), `beforeend`);
render(cardsListSection, createCardsListTemplate(), `beforeend`);

const cards = generateCards(CARDS_COUNT);

const cardsListElement = cardsListSection.querySelector(`.trip-days`);
render(cardsListElement, createDayListTemplate(cards), `beforeend`);

render(cardsListElement, createCardEditTemplate(cards[0]), `beforebegin`);

const tripInfoSection = document.querySelector(`.trip-main__trip-info`);
render(tripInfoSection, createTripInfoTemplate(cards), `afterbegin`);
