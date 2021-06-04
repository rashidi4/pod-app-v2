import Base from './Base';
import Episode from './Episode';


export default class Feed extends Base {
  constructor(rss) {
    super();

    if (rss && rss.channel && rss.channel.length) {
      this._data = rss.channel[0];
    } else {
      this._data = {};
    }

    // limit for now
    if (this._data.item && this._data.item.length > 20) {
      this._data.item = this._data.item.slice(0, 20);
    }
  }

  get image() {
    const image = this.get('image');
    if (image && image.length) {
      return image[0];
    }

    return null;
  }

  get imageUrl() {
    const image = this.image;
    if (image) {
      return image.url[0];
    }
    return null;
  }


  get item(){
    const item = this.get('item');
    return item.map(data => new Episode(data))
  }

  get title(){
    const title = this.get('title') || [];
    return title[0];
  }

  get summary() {
    return this.get('itunes:summary');
  }


}
