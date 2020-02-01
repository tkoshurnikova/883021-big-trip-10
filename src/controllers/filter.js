import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {FilterType, getCardsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._cardsModel.setOnDataChange(this._onDataChange);
  }

  render() {
    const container = this._container;
    const oldComponent = this._filterComponent;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        isDisabled: getCardsByFilter(this._cardsModel.getCards(), filterType).length === 0 ? true : false
      };
    });

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
