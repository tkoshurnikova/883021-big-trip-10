import CardComponent from '../components/card.js';
import CardEditComponent from '../components/card-edit.js';
import SortComponent from '../components/sort.js';
import CardsListComponent from '../components/cards-list.js';
import DayListComponent from '../components/day-list.js';
import NoCardsComponent from '../components/no-cards.js';
import TripInfoComponent from '../components/trip-info.js';

import {render, replace, RenderPosition} from '../utils/render.js';

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._cardsListComponent = new CardsListComponent();
    this._noCardsComponent = new NoCardsComponent();
  }

  renderCard(card, day) {
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

    cardComponent.setEditButtonClickHandler(() => {
      replaceCardToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    cardEditComponent.setRollUpButtonClickHandler(() => replaceEditToCard());
    cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      replaceEditToCard();
    });

    render(daysList, cardComponent, RenderPosition.BEFOREEND);
  }

  renderCards(cards) {
    const container = this._container;
    const doCardsExist = cards.length;

    if (doCardsExist) {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
      render(container, this._cardsListComponent, RenderPosition.BEFOREEND);

      const cardsListElement = container.querySelector(`.trip-days`);
      const startDates = cards.map((card) => card.startDate.toDateString());
      const uniqueDates = Array.from(new Set(startDates)).sort((a, b) => {
        return new Date(a) - new Date(b);
      });

      uniqueDates.forEach((uniqueDate) => {
        const uniqueDateNumber = uniqueDates.indexOf(uniqueDate) + 1;
        const day = new DayListComponent(uniqueDate, uniqueDateNumber);
        cards
        .filter((card) => card.startDate.getDate() === new Date(uniqueDate).getDate())
        .forEach((card) => this.renderCard(card, day.getElement()));

        render(cardsListElement, day, RenderPosition.BEFOREEND);
      });

      const sortedCards = cards.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      });
      const tripMain = document.querySelector(`.trip-main`);
      render(tripMain, new TripInfoComponent(sortedCards), RenderPosition.AFTERBEGIN);
    } else {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND);
    }
  }
}
