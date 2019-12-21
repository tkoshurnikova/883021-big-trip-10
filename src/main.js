import CardEditComponent from './components/card-edit.js';
import CardsListComponent from './components/cards-list.js';
import DayListComponent from './components/day-list.js';
import FilterComponent from './components/filter.js';
import SiteMenuComponent from './components/site-menu.js';
import SortComponent from './components/sort.js';
import TripInfoComponent from './components/trip-info.js';
import CardComponent from './components/card.js';
import NoCardsComponent from './components/no-cards.js';

import {generateFilters} from './mock/filter.js';
import {generateCards} from './mock/card.js';
import {render, replace, RenderPosition} from './utils/render.js';

const CARDS_COUNT = 4;

const siteHeaderElement = document.querySelector(`.trip-main__trip-controls`);
render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.AFTERBEGIN);

const filters = generateFilters();
render(siteHeaderElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const cardsListSection = document.querySelector(`.trip-events`);
const cards = generateCards(CARDS_COUNT);

const doCardsExist = cards.length;

if (doCardsExist) {
  render(cardsListSection, new SortComponent(), RenderPosition.BEFOREEND);
  render(cardsListSection, new CardsListComponent(), RenderPosition.BEFOREEND);

  const cardsListElement = cardsListSection.querySelector(`.trip-days`);
  const startDates = cards.map((card) => card.startDate.toDateString());
  const uniqueDates = Array.from(new Set(startDates)).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  const renderCard = (card, day) => {
    const cardComponent = new CardComponent(card);
    const cardEditComponent = new CardEditComponent(card);
    const daysList = day.querySelector(`.trip-events__list`);

    const replaceCardToEdit = () => {
      replace(cardEditComponent, cardComponent);
    };

    const replaceEditToCard = () => {
      replace(cardComponent, cardEditComponent);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const editButton = cardComponent.getElement().querySelector(`.event__rollup-btn`);
    editButton.addEventListener(`click`, () => {
      replaceCardToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const closeButton = cardEditComponent.getElement().querySelector(`.event__rollup-btn`);
    closeButton.addEventListener(`click`, () => replaceEditToCard());

    const editForm = cardEditComponent.getElement();
    editForm.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceEditToCard();
    });

    render(daysList, cardComponent, RenderPosition.BEFOREEND);
  };

  uniqueDates.forEach((uniqueDate) => {
    const uniqueDateNumber = uniqueDates.indexOf(uniqueDate) + 1;
    const day = new DayListComponent(uniqueDate, uniqueDateNumber);
    cards
    .filter((card) => card.startDate.getDate() === new Date(uniqueDate).getDate())
    .forEach((card) => renderCard(card, day.getElement()));

    render(cardsListElement, day, RenderPosition.BEFOREEND);
  });

  const sortedCards = cards.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
  const tripMain = document.querySelector(`.trip-main`);
  render(tripMain, new TripInfoComponent(sortedCards), RenderPosition.AFTERBEGIN);
} else {
  render(cardsListSection, new NoCardsComponent(), RenderPosition.BEFOREEND);
}
