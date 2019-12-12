const EVENTS = [
  {
    name: `Bus`,
    icon: `img/icons/bus.png`,
    group: `Tranfer`
  },
  {
    name: `Check-in`,
    icon: `img/icons/check-in.png`,
    group: `Activity`
  },
  {
    name: `Drive`,
    icon: `img/icons/drive.png`,
    group: `Tranfer`
  },
  {
    name: `Flight`,
    icon: `img/icons/flight.png`,
    group: `Tranfer`
  },
  {
    name: `Restaurant`,
    icon: `img/icons/restaurant.png`,
    group: `Activity`
  },
  {
    name: `Ship`,
    icon: `img/icons/ship.png`,
    group: `Tranfer`
  },
  {
    name: `Sightseeing`,
    icon: `img/icons/sightseeing.png`,
    group: `Activity`
  },
  {
    name: `Taxi`,
    icon: `img/icons/taxi.png`,
    group: `Tranfer`
  },
  {
    name: `Train`,
    icon: `img/icons/train.png`,
    group: `Tranfer`
  },
  {
    name: `Transport`,
    icon: `img/icons/transport.png`,
    group: `Tranfer`
  },
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
  },
  {
    type: `train`,
    name: `Travel by train`,
    price: 40
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
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElements = (array, count) => {
  const randomElements = [];
  for (let i = 0; i < count; i++) {
    randomElements.push(getRandomArrayElement(array));
  }
  return randomElements;
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
  const diffDateValue = sign * getRandomIntegerNumber(0, 2);
  const diffHoursValue = sign * getRandomIntegerNumber(0, 24);
  const diffMinutesValue = sign * getRandomIntegerNumber(0, 60);

  targetDate.setDate(targetDate.getDate() + diffDateValue);
  targetDate.setHours(targetDate.getHours() + diffHoursValue);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutesValue);

  return targetDate;
};

const generateCard = () => {
  const photosCount = getRandomIntegerNumber(PHOTO_COUNT_MIN, PHOTO_COUNT_MAX);
  const descriptionSentencesCount = getRandomIntegerNumber(SENTENCES_COUNT_MIN, SENTENCES_COUNT_MAX);
  const optionsCount = getRandomIntegerNumber(OPTIONS_COUNT_MIN, OPTIONS_COUNT_MAX);
  const firstRandomDate = getRandomDate();
  const secondRandomDate = getRandomDate();
  const startDate = (firstRandomDate < secondRandomDate) ? firstRandomDate : secondRandomDate;
  const endDate = (firstRandomDate > secondRandomDate) ? firstRandomDate : secondRandomDate;

  return {
    type: getRandomArrayElement(EVENTS),
    destination: getRandomArrayElement(CITIES),
    photos: generateArray(photosCount, generatePhoto),
    description: getRandomArrayElements(DESCRIPTION, descriptionSentencesCount),
    startDate,
    endDate,
    price: getRandomIntegerNumber(PRICE_MIN, PRICE_MAX),
    options: Array.from(new Set(getRandomArrayElements(OPTIONS, optionsCount)))
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCards, EVENTS, CITIES, OPTIONS};
