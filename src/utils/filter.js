import moment from 'moment';

const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const isFutureDate = (date, today) => {
  return moment(date).diff(moment(today)) > 0;
};

const isPastDate = (date, today) => {
  return moment(date).diff(moment(today)) < 0;
};

const getFutureCards = (cards, date) => {
  return cards.filter((card) => isFutureDate(card.startDate, date));
};

const getPastCards = (cards, date) => {
  return cards.filter((card) => isPastDate(card.endDate, date));
};

const getCardsByFilter = (cards, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.FUTURE:
      return getFutureCards(cards, nowDate);
    case FilterType.PAST:
      return getPastCards(cards, nowDate);
    case FilterType.ALL:
      return cards;
  }

  return cards;
};

export {FilterType, getCardsByFilter};
