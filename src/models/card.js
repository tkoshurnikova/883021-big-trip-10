export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`].name;
    this.photos = data[`destination`].pictures;
    this.description = data[`destination`].description;
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': this.startDate.toISOString(),
      'date_to': this.endDate.toISOString(),
      // 'destination':,
      'is_favorite': this.isFavorite,
      // 'offers': ,
      'type': this.type
    };
  }

  static parseCard(data) {
    return new Card(data);
  }

  static parseCards(data) {
    return data.map(Card.parseCard);
  }

  static clone(data) {
    return new Card(data.toRAW());
  }
}
