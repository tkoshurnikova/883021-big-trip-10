const EVENTS = {
  TRANSFER: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  ACTIVITY: [`check-in`, `restaurant`, `sightseeing`]
};

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

const OFFERS = [
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
const OFFERS_COUNT_MIN = 0;
const OFFERS_COUNT_MAX = 2;
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

const generateDescription = () => {
  const descriptionSentencesCount = getRandomIntegerNumber(SENTENCES_COUNT_MIN, SENTENCES_COUNT_MAX);
  return getRandomArrayElements(DESCRIPTION, descriptionSentencesCount);
};

const DESTINATIONS = [
  {
    city: `Amsterdam`,
    description: generateDescription()
  },
  {
    city: `Budapest`,
    description: generateDescription()
  },
  {
    city: `Paris`,
    description: generateDescription()
  },
  {
    city: `London`,
    description: generateDescription()
  },
  {
    city: `Moscow`,
    description: generateDescription()
  },
];

const generateCard = () => {
  const photosCount = getRandomIntegerNumber(PHOTO_COUNT_MIN, PHOTO_COUNT_MAX);
  const offersCount = getRandomIntegerNumber(OFFERS_COUNT_MIN, OFFERS_COUNT_MAX);
  const firstRandomDate = getRandomDate();
  const secondRandomDate = getRandomDate();
  const startDate = (firstRandomDate < secondRandomDate) ? firstRandomDate : secondRandomDate;
  const endDate = (firstRandomDate > secondRandomDate) ? firstRandomDate : secondRandomDate;
  const destination = getRandomArrayElement(DESTINATIONS);

  return {
    id: String(new Date() + Math.random()),
    type: (Math.random() > 0.5) ? getRandomArrayElement(EVENTS.TRANSFER) : getRandomArrayElement(EVENTS.ACTIVITY),
    destination: destination.city,
    photos: generateArray(photosCount, generatePhoto),
    description: destination.description,
    startDate,
    endDate,
    price: getRandomIntegerNumber(PRICE_MIN, PRICE_MAX),
    offers: Array.from(new Set(getRandomArrayElements(OFFERS, offersCount))),
    isFavorite: Math.random() > 0.5
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCards, EVENTS, DESTINATIONS, OFFERS};
