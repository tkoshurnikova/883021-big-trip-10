import CardComponent from '../components/card.js';
import CardEditComponent from '../components/card-edit.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyCard = {
  type: `bus`,
  destination: ``,
  photos: [],
  description: ``,
  startDate: new Date(),
  endDate: new Date(),
  price: ``,
  offers: [],
  isFavorite: false
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
    this._card = null;
  }

  render(card, mode) {
    this._card = card;
    this._mode = mode;

    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardComponent(this._card);
    const container = this._container.getElement().querySelector(`.trip-events__list`);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardComponent && oldCardEditComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
        } else {
          render(container, this._cardComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldCardComponent && oldCardEditComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        this._cardEditComponent = new CardEditComponent(this._card, Mode.ADDING);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(container, this._cardEditComponent, RenderPosition.AFTERBEGIN);
        this._setEditCardListeners();
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  destroy() {
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    if (this._cardEditComponent) {
      remove(this._cardEditComponent);
    }
  }

  _replaceCardToEdit() {
    this._onViewChange();
    this._cardEditComponent = new CardEditComponent(this._card);
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
    this._setEditCardListeners();
  }

  _replaceEditToCard() {
    replace(this._cardComponent, this._cardEditComponent);
    this._mode = Mode.DEFAULT;
    this._cardEditComponent.removeElement();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _setEditCardListeners() {
    document.addEventListener(`keydown`, this._onEscKeyDown);

    if (this._mode !== Mode.ADDING) {
      this._cardEditComponent.setRollUpButtonClickHandler(() => {
        this._replaceEditToCard();
      });

      this._cardEditComponent.setFavoriteButtonClickHandler(() => {
        this._onDataChange(this, this._card, Object.assign({}, this._card, {
          isFavorite: !this._card.isFavorite
        }));
      });
    }

    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._cardEditComponent.getData();
      this._onDataChange(this, this._card, data);
      this._replaceEditToCard();
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, this._card, null));
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyCard, null);
      } else {
        this._replaceEditToCard();
      }
    }
  }
}
