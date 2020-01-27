import AbstractComponent from './abstract-component.js';

export const MenuItem = {
  STATS: `stats-tab`,
  TABLE: `table-tab`
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="table-tab">Table</a>
      <a class="trip-tabs__btn" href="#" id="stats-tab">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((tab) => tab.classList.remove(`trip-tabs__btn--active`));
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;
      this.setActiveItem(menuItem);
      handler(menuItem);
    });
  }
}
