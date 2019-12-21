import AbstractComponent from './abstract-component.js';

const createCardsListTemplate = () => {
  return (
    `<ul class="trip-days">
    </ul>`
  );
};

export default class CardsList extends AbstractComponent {
  getTemplate() {
    return createCardsListTemplate();
  }
}
