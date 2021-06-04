export class TextModel {
  constructor(transcription, activeMarkers, selection) {
    this._trascription = transcription;
    this._activeMarkers = activeMarkers;
    this._selection = selection || {};
    this.words = this._words();
    this.markers = this._markers();
    this.markerIndexes = this._markerIndexes();
    this.toStringObj = this._toString();
    this.text =  this.toStringObj.map(w => w.word).join('');
    // now i can use selection on toStringObj
    // to figure out words that have been selected
    let characterCount = 0;
    const { start: startSelection, end: endSelection } = selection || {};
    if (typeof startSelection !== 'undefined' && endSelection !== 'undefined') {
      this.toStringObj = this.toStringObj.map((w) => {
        const word = w.word.replace(/\n/g, ' ');
        // if the last character is a , or . or anything but a, allow selection

        const endBuffer = /\w$/.test(word.trim())
          ? 0
          : 1;


        if (characterCount >= startSelection && characterCount + word.trim().length - endBuffer <= endSelection + 1) {
          this.words[w.index].isSelected = true;
          characterCount += word.length;
          return {
            ...w,
            isSelected: true
          };
        }
        this.words[w.index].isSelected = false;
        characterCount += word.length;
        return w;
      });
    }
  }

  static secondsToMinutes = (SECONDS) => {
    const date = new Date(null);
    date.setSeconds(SECONDS); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
  };

  _words() {
    const ret = [];
    if (!this._trascription) return [];
    const {words = []} = this._trascription;

    let lastInsertedTS = null;
    let index = 0;
    words.forEach((word) => {
      const sec = TextModel.secondsToMinutes(parseFloat(word.startTime));
      if (/((:00)|(:15)|(:30)|(:45))$/.test(sec) && sec !== lastInsertedTS) {
        const word = `[mark: ${sec}]\n`;
        ret.push({
          word,
          secondsText: sec,
          isMarker: true,
          index,
        });
        index += 1;
        lastInsertedTS = sec;
      }
      ret.push({
        ...word,
        secondsText: lastInsertedTS,
        index
      });
      index += 1;
    });
    return ret;
  }

  _markers() {
    const { words = [] } = this;
    const activeMarkers = this._activeMarkers || [];
    return words
      .filter(word => word.isMarker)
      .map((word) => ({
        ...word,
        isActive: activeMarkers.indexOf(word.secondsText) > -1
      }));
  }

  _markerIndexes() {
    const { markers } = this;
    const activeIndexes = markers.reduce((acc, cur, index) => {
      if (cur.isActive) {
        return [...acc, index];
      }
      return acc;
    }, []);
    return {
      first: activeIndexes[0],
      last: activeIndexes[activeIndexes.length - 1],
    };
  }

  filterActiveWords(){
    const {words, markers} = this;
    const activeMarkers = markers.filter(m => m.isActive);
    return words
      .filter(word => activeMarkers.some(marker => marker.secondsText === word.secondsText));
  }

  _toString() {
    if (this._toStringCache) return this._toStringCache;
    this._toStringCache = this.filterActiveWords()
      .map((word, i) => {
        if (i === 0) return word;
        if (/^\[/.test(word.word)) {
          return {
            ...word,
            word:  `\n\n${word.word}`
          };

        }
        return {
          ...word,
          word: `${word.word} `
        }
      });

    let char = 0;
    this._toStringCache = this._toStringCache.map(word => {
      const text = word.word;
      const len = text.length;
      const ret = {
        ...word,
        len,
        charStart: char
      };
      char += len;
      return ret;
    });


    return this._toStringCache;
  }

  toString() {
    return this.text;
  }

  get selectedWords() {
    if (this._selectedWords) return this._selectedWords;
    this._selectedWords = this.words
      .filter(word => word.isSelected && !word.isMarker);
    return this._selectedWords;
  }

  get selectedText() {
    if (this._selectedText) return this._selectedText;
    this._selectedText = this.selectedWords.map(w => w.word).join(' ');
    return this._selectedText;
  }

  get selectedMillis() {
    const words = this.selectedWords;
    if (words.length < 1) return {};

    const first = words[0];
    const last = words[words.length - 1];
    // '100.100s'
    return {
      startMillis: parseFloat(first.startTime) * 1000,
      endMillis: parseFloat(last.endTime) * 1000
    }
  }
}
