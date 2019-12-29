import SortComponent, {SortType} from '../components/sort.js';
import CardsListComponent from '../components/cards-list.js';
import DayListComponent from '../components/day-list.js';
import NoCardsComponent from '../components/no-cards.js';
import TripInfoComponent from '../components/trip-info.js';
import PointController from './point.js';

import {render, RenderPosition} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._cardsListComponent = new CardsListComponent();
    this._noCardsComponent = new NoCardsComponent();
  }

  renderCards(cards) {
    const container = this._container;
    const doCardsExist = cards.length;
    const sortedCardsByDate = cards.slice().sort((a, b) => {
      return a.startDate - b.startDate;
    });

    if (doCardsExist) {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
      render(container, this._cardsListComponent, RenderPosition.BEFOREEND);

      const cardsListElement = container.querySelector(`.trip-days`);
      const startDates = cards.map((card) => card.startDate.toDateString());
      const uniqueDates = Array.from(new Set(startDates)).sort((a, b) => {
        return new Date(a) - new Date(b);
      });

      const renderCardsByDays = () => {
        uniqueDates.forEach((uniqueDate) => {
          const uniqueDateNumber = uniqueDates.indexOf(uniqueDate) + 1;
          const day = new DayListComponent(uniqueDate, uniqueDateNumber);
          sortedCardsByDate
          .filter((card) => card.startDate.getDate() === new Date(uniqueDate).getDate())
          .forEach((card) => new PointController(day).render(card));
          render(cardsListElement, day, RenderPosition.BEFOREEND);
        });
      };

      renderCardsByDays();

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        let sortedCards = [];

        switch (sortType) {

          case SortType.TIME:
            sortedCards = cards.slice().sort((a, b) => {
              return (b.endDate - b.startDate) - (a.endDate - a.startDate);
            });
            break;

          case SortType.PRICE:
            sortedCards = cards.slice().sort((a, b) => {
              return b.price - a.price;
            });
            break;

          case SortType.EVENT:
            sortedCards = cards;
            break;
        }

        cardsListElement.innerHTML = ``;
        const dayBlockWithoutDate = new DayListComponent(``, ``);
        render(cardsListElement, dayBlockWithoutDate, RenderPosition.BEFOREEND);

        if (sortType === SortType.EVENT) {
          renderCardsByDays();
        } else {
          sortedCards.forEach((card) => new PointController(dayBlockWithoutDate).render(card));
        }
      });

      const tripMain = document.querySelector(`.trip-main`);
      render(tripMain, new TripInfoComponent(sortedCardsByDate), RenderPosition.AFTERBEGIN);
    } else {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
    }
  }
}
