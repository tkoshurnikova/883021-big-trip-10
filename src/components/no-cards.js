import AbstractComponent from './abstract-component.js';

const createNoCardsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class NoCards extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}
