import Base from './Base';

export default class Episode extends Base {
  constructor(data) {
    super();
    this._data = data;
  }

  get artist(){
    return this.get('authorName');
  }

  get audio() {
    const enc = this.get('enclosure');
    if (enc && enc.length) {
      return {
        length: parseInt(enc[0]['$'].length, 10),
        type: enc[0]['$'].type,
        url: enc[0]['$'].url,
      }
    }
    return {};
  }

  get date () {
    const date = this.get('pubDate');
    if (date && date.length) {
      return new Date(date[0])
    }
    return null;
  }

  get dateAsText() {
    const date = this.date;
    if (!date) return null;

    const today = new Date();
    const isToday = (today.toDateString() === date.toDateString());
    if (isToday) {
      return 'Today';
    }
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  get id (){
    const guidArr = this.get('guid');
    if (guidArr && guidArr.length) {
      return guidArr[0]['_'];
    }
    return null;
  }

  get description() {
    const description = this.get('description') || [];
    return description[0];
  }

  get duration() {
    const d =  this.get('itunes:duration');
    if (d && d.length) {
      return d[0];
    }
    return null;
  }

  get feedUrl() {
    return this.get('feedUrl');
  }

  get imageUrl() {
    const image = this.get('itunes:image');
    if (image && image.length) {
      return image[0]['$'].href;
    }
    return null;
  }

  get podcastImageUrl() {
    return this.get('podcastImageUrl');
  }

  get title() {
    const title = this.get('title') || [];
    return title[0];
  }

}
