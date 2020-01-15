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
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cards = [];
    this._pointControllers = [];
  }

  renderCards(cards) {
    this._cards = cards;
    const container = this._container;
    const doCardsExist = this._cards.length;
    const sortedCardsByDate = this._cards.slice().sort((a, b) => {
      return a.startDate - b.startDate;
    });

    if (doCardsExist) {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
      render(container, this._cardsListComponent, RenderPosition.BEFOREEND);

      const cardsListElement = container.querySelector(`.trip-days`);
      const startDates = this._cards.map((card) => card.startDate.toDateString());
      const uniqueDates = Array.from(new Set(startDates)).sort((a, b) => {
        return new Date(a) - new Date(b);
      });

      const renderCardsByDays = () => {
        const pointControllers = [];
        uniqueDates.forEach((uniqueDate) => {

          const uniqueDateNumber = uniqueDates.indexOf(uniqueDate) + 1;
          const day = new DayListComponent(uniqueDate, uniqueDateNumber);

          sortedCardsByDate
          .filter((card) => card.startDate.getDate() === new Date(uniqueDate).getDate())
          .forEach((card) => {
            const pointController = new PointController(day, this._onDataChange, this._onViewChange);
            pointController.render(card);
            pointControllers.push(pointController);
          });

          render(cardsListElement, day, RenderPosition.BEFOREEND);
        });

        return pointControllers;
      };

      this._pointControllers = renderCardsByDays();
      const tripMain = document.querySelector(`.trip-main`);

      if (!tripMain.querySelector(`.trip-info`)) {
        render(tripMain, new TripInfoComponent(sortedCardsByDate), RenderPosition.AFTERBEGIN);
      }

    } else {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
    }
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];

    switch (sortType) {

      case SortType.TIME:
        sortedCards = this._cards.slice().sort((a, b) => {
          return (b.endDate - b.startDate) - (a.endDate - a.startDate);
        });
        break;

      case SortType.PRICE:
        sortedCards = this._cards.slice().sort((a, b) => {
          return b.price - a.price;
        });
        break;

      case SortType.EVENT:
        sortedCards = this._cards;
        break;
    }

    const cardsListElement = this._cardsListComponent.getElement();
    cardsListElement.innerHTML = ``;
    const dayBlockWithoutDate = new DayListComponent(``, ``);
    render(cardsListElement, dayBlockWithoutDate, RenderPosition.BEFOREEND);

    if (sortType === SortType.EVENT) {
      this.renderCards(this._cards);
    } else {
      const pointControllers = [];
      const renderCardsWithoutDays = () => {
        sortedCards.forEach((card) => {
          const pointController = new PointController(dayBlockWithoutDate, this._onDataChange, this._onViewChange);
          pointController.render(card);
          pointControllers.push(pointController);
        });
        return pointControllers;
      };
      this._pointControllers = renderCardsWithoutDays();
    }
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._cards.findIndex((card) => card === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    pointController.render(this._cards[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }
}
