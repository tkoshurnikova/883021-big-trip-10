const ICONS = [
  `../../markup/img/icons/bus.png`,
  `../../markup/img/icons/check-in.png`,
  `../../markup/img/icons/drive.png`,
  `../../markup/img/icons/flight.png`,
  `../../markup/img/icons/restaurant.png`,
  `../../markup/img/icons/ship.png`,
  `../../markup/img/icons/sightseeing.png`,
  `../../markup/img/icons/taxi.png`,
  `../../markup/img/icons/train.png`,
  `../../markup/img/icons/transport.png`,
  `../../markup/img/icons/trip.png`
];

const CITIES = [
  `Amsterdam`,
  `Budapest`,
  `Paris`,
  `London`,
  `Moscow`
];

const DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const OPTIONS = [
  {
    type: `luggage`,
    name: `Add luggage`,
    price: 10
  },
  {
    type: `class`,
    name: `Switch to comfort class`,
    price: 150
  },
  {
    type: `meal`,
    name: `Add meal`,
    price: 2
  },
  {
    type: `seats`,
    name: `Choose seats`,
    price: 9
  }
];

const PHOTO_COUNT_MIN = 1;
const PHOTO_COUNT_MAX = 4;
const SENTENCES_COUNT_MIN = 1;
const SENTENCES_COUNT_MAX = 3;
const OPTIONS_COUNT_MIN = 0;
const OPTIONS_COUNT_MAX = 2;
const PRICE_MIN = 0;
const PRICE_MAX = 1000;

const getRandomArrayElement = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePhoto = () => {
  return `http://picsum.photos/300/150?r=${Math.random()}`;
};

const generateArray = (count, element) => {
  return new Array(count)
    .fill(``)
    .map(element);
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 31);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateCard = () => {
  const photosCount = getRandomIntegerNumber(PHOTO_COUNT_MIN, PHOTO_COUNT_MAX);
  const descriptionSentencesCount = getRandomIntegerNumber(SENTENCES_COUNT_MIN, SENTENCES_COUNT_MAX);
  const optionsCount = getRandomIntegerNumber(OPTIONS_COUNT_MIN, OPTIONS_COUNT_MAX);
  const startDate = getRandomDate();
  const endDate = getRandomDate();

  return {
    icon: getRandomArrayElement(ICONS),
    city: getRandomArrayElement(CITIES),
    photos: generateArray(photosCount, generatePhoto),
    description: generateArray(descriptionSentencesCount, getRandomArrayElement(DESCRIPTION)),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    price: getRandomIntegerNumber(PRICE_MIN, PRICE_MAX),
    options: generateArray(optionsCount, getRandomArrayElement(OPTIONS))
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCards};
