import CardComponent from '../components/card.js';
import CardEditComponent from '../components/card-edit.js';
import {render, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(card) {
    this._card = card;
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardComponent(this._card);
    const container = this._container.getElement().querySelector(`.trip-events__list`);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
    });

    if (oldCardComponent && oldCardEditComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardEditComponent, oldCardEditComponent);
    } else {
      render(container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
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
    this._cardEditComponent.setRollUpButtonClickHandler(() => this._replaceEditToCard());
    this._cardEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
    });

    this._cardEditComponent.setFavoriteButtonHandler(() => {
      this._onDataChange(this, this._card, Object.assign({}, this._card, {
        isFavorite: !this._card.isFavorite
      }));
    });
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToCard();
    }
  }
}
