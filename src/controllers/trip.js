import SortComponent, {SortType} from '../components/sort.js';
import CardsListComponent from '../components/cards-list.js';
import DayListComponent from '../components/day-list.js';
import NoCardsComponent from '../components/no-cards.js';
import TripInfoComponent from '../components/trip-info.js';
import PointController, {Mode as PointControllerMode, EmptyCard} from './point.js';

import {render, RenderPosition} from '../utils/render.js';

export default class TripController {
  constructor(container, cardsModel, destinations, offers, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._destinations = destinations;
    this._offers = offers;
    this._api = api;

    this._creatingCard = null;

    this._sortComponent = new SortComponent();
    this._cardsListComponent = new CardsListComponent();
    this._noCardsComponent = new NoCardsComponent();

    this._activeSortType = SortType.EVENT;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);

    this._pointControllers = [];
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  render() {
    const container = this._container;
    const cards = this._cardsModel.getCards();
    const doCardsExist = cards.length;

    if (doCardsExist) {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
      render(container, this._cardsListComponent, RenderPosition.BEFOREEND);
      this._renderCards(cards);
    } else {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
    }
  }

  _renderCards(cards) {
    const container = this._container;
    const sortedCardsByDate = cards.slice().sort((a, b) => {
      return a.startDate - b.startDate;
    });

    const cardsListElement = container.querySelector(`.trip-days`);
    const startDates = cards.map((card) => card.startDate.toDateString());
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
          const pointController = new PointController(day, this._onDataChange, this._onViewChange, this._destinations, this._offers);
          pointController.render(card, PointControllerMode.DEFAULT);
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
  }

  createCard() {
    this._onViewChange();
    if (this._creatingCard) {
      return;
    }
    const cardsListElement = this._cardsListComponent;
    this._creatingCard = new PointController(cardsListElement, this._onDataChange, this._onViewChange, this._destinations, this._offers);
    this._creatingCard.render(EmptyCard, PointControllerMode.ADDING);
  }

  _removeCards() {
    const cardsListElement = this._cardsListComponent.getElement();
    cardsListElement.innerHTML = ``;
    this._pointControllers = [];
  }

  _updateCards() {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards());
  }

  _onSortTypeChange(sortType) {
    this._activeSortType = sortType;

    let sortedCards = [];
    const cards = this._cardsModel.getCards();

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

    const cardsListElement = this._cardsListComponent.getElement();
    cardsListElement.innerHTML = ``;
    const dayBlockWithoutDate = new DayListComponent(``, ``);
    render(cardsListElement, dayBlockWithoutDate, RenderPosition.BEFOREEND);

    if (sortType === SortType.EVENT) {
      this._renderCards(cards);
    } else {
      const pointControllers = [];
      const renderCardsWithoutDays = () => {
        sortedCards.forEach((card) => {
          const pointController = new PointController(dayBlockWithoutDate, this._onDataChange, this._onViewChange, this._destinations, this._offers);
          pointController.render(card, PointControllerMode.DEFAULT);
          pointControllers.push(pointController);
        });
        return pointControllers;
      };
      this._pointControllers = renderCardsWithoutDays();
    }
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyCard) {
      this._creatingCard = null;
      if (newData === null) {
        pointController.destroy();
        this._updateCards();
      } else {
        pointController.blockOnSave();
        this._api.createCard(newData)
          .then((cardModel) => {
            this._cardsModel.addCard(cardModel);
            pointController.render(cardModel, PointControllerMode.DEFAULT);
            this._pointControllers = [].concat(pointController, this._pointControllers);
            this._onSortTypeChange(this._sortComponent.getCurrentSortType());
          });
      }
    } else if (newData === null) {
      pointController.blockOnSave();
      this._api.deleteCard(oldData.id)
        .then(() => {
          this._cardsModel.removeCard(oldData.id);
          this._updateCards();
          this._onSortTypeChange(this._sortComponent.getCurrentSortType());
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      pointController.blockOnSave();
      this._api.updateCard(oldData.id, newData)
      .then((cardModel) => {
        const isSuccess = this._cardsModel.updateCard(oldData.id, cardModel);

        if (isSuccess) {
          pointController.render(cardModel, PointControllerMode.DEFAULT);
        }

        this._onSortTypeChange(this._sortComponent.getCurrentSortType());
      })
      .catch(() => {
        pointController.shake();
      });
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
    if (this._creatingCard) {
      this._creatingCard.destroy();
      this._creatingCard = null;
    }
  }

  _onFilterChange() {
    this._updateCards();
  }
}
