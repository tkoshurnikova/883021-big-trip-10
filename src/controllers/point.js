import CardComponent from '../components/card.js';
import CardEditComponent from '../components/card-edit.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class PointController {
  constructor(container) {
    this._container = container;
  }

  render(card) {
    const cardComponent = new CardComponent(card);
    const cardEditComponent = new CardEditComponent(card);
    const container = this._container.getElement().querySelector(`.trip-events__list`);

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

    render(container, cardComponent, RenderPosition.BEFOREEND);
  }
}
