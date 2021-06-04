import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import SnippetLoader from './components/SnippetLoader.service';
import {getMinute, minutesToSeconds} from '../../../../util'



class SnippetManager extends Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    const {
      minute,
      duration,
      episodeDuration,
    } = props;

    let pre = 5;
    const post = 5;
    const startTime = getMinute(minute, pre * -1);
    if (startTime === '00:00:00') {
      pre = 0;
    }
    const selection = [[], []];

    const snippets = [{
      minute: startTime,
      duration,
      episodeDuration,
      pre,
      post,
      selection,
    }];

    this.state = {
      currentMinute: props.minute,
      snippets,
      selection,
    };
  }

  componentDidUpdate(previousProps) {
    const {minute, disabled} = this.props;
    // reset manager for running snippets while its closed
    if (minute !== previousProps.minute && disabled) {
      // this.setState({currentMinute: minute});
      this.resetSnippets(minute);
    }
  }

  getWordsForSnippetDuration = (data, snippet) => {
    if (data.audioText.status !== 'COMPLETE') return null;
    const {result} = data.audioText.clip.transcription;
    const {duration, pre} = snippet;

    return result.words.filter(word => {
      // end time
      if (word.endTime.seconds + ((word.endTime.millis) / 1000) > duration + pre) {
        return false;
      }
      // start time

      const start = word.endTime.seconds + (word.endTime.millis / 1000);
      return start >= pre || pre < 1;
    })
      // this seems unneed but it is forcing an update that is hack
    .map(word => ({
      ...word,
      word: word.word
    }));
  };
  previous = () => {
    const {snippets} = this.state;
    const first = snippets[0];
    if (first.minute === '00:00:00') {
      return null;
    }
    const startTime = getMinute(first.minute, -15);
    const snip = {
      ...first,
      minute: startTime,
      pre: startTime === '00:00:00' ? 0 : 5,
      post: 5,
      data: null,
      words: null,
    };
    setTimeout(() => {
      this.scrollRef.current.scrollTo({y: 0, x: 0, animated: true});
    }, 200);

    return new Promise((resolve) => {
      this.setState({
        snippets: [
          snip,
          ...snippets.map(sn => ({
            ...sn,
            index: snip.index + 1
          })),
        ]
      }, resolve);
    });


  };
  next = () => {
    const {snippets} = this.state;
    const last = snippets[snippets.length - 1];
    const offset = last.minute === '00:00:00'
      ? 10
      : 15;
    const snip = {
      ...last,
      minute: getMinute(last.minute, offset),
      pre: 5,
      post: 5,
      data: null,
      words: null,
    };
    setTimeout(() => {
      this.scrollRef.current.scrollToEnd({animated: true});
    }, 200);
    return new Promise((resolve) => {
      this.setState({
        snippets: [
          ...snippets,
          snip,
        ]
      }, resolve);
    });


  };
  getTextFromSelection = ({ snippets, selection }) => {
    const [start, end] = selection;

    // const selectedSnippets = snippets.slice(start[0], end[0] + 1);
    const words = snippets.reduce((words, snippet, snippetIndex) => {
      // if its the first snippet, cut until end (if multiple snippets)
      // or until end[0][1]

      const wordsFromSnippet = (snippet.words || []).filter((word, wordIndex) => {
        if (snippetIndex < start[0]) {
          return false;
        }
        if (snippetIndex > end[0]) {
          return false;
        }
        if (snippetIndex === start[0]) {
          if (wordIndex < start[1]) {
            return false;
          }
        }
        if (snippetIndex === end[0]) {
          if (wordIndex > end[1]) {
            return false;
          }
        }

        return true;
      });
      return words.concat(wordsFromSnippet);
    }, []);

    return words.map(w => w.word).join(' ');

  };
  setSelection = ({word, i}) => {
    const {selection, snippets} = this.state;
    const { onSelection } = this.props;
    let [start, end] = selection;
    const {index} = word;
    let sel;
    if (start.length === 0 && end.length === 0) {
      sel = [[i, index], selection[1]];
    } else if (start.length > 1 && end.length === 0) {
      sel = [selection[0], [i, index]];
      if (sel[0][0] === sel[1][0] && sel[0][1] > sel[1][1]) {
        sel.reverse();
      } else if (sel[0][0] !== sel[1][0] && sel[0][0] > sel[1][0]) {
        sel.reverse();
      }

    } else {
      sel = [[], []];
    }
    this.setState({selection: sel });
    [start, end] = sel;
    let startMillis = null;
    let endMillis = null;
    let text = null;
    if (start && start.length && end && end.length) {
      const firstSnippet = snippets[start[0]];
      const lastSnippet = snippets[end[0]];
      const startWord = firstSnippet.words[start[1]];
      const startTime = (startWord.startTime.seconds * 1000) + startWord.startTime.millis;
      startMillis = (minutesToSeconds(firstSnippet.minute) * 1000) + startTime;
      const endWord = lastSnippet.words[end[1]];
      const endTime = (endWord.endTime.seconds * 1000) + endWord.endTime.millis;
      endMillis = (minutesToSeconds(lastSnippet.minute) * 1000) + endTime;

      text = this.getTextFromSelection({ snippets, selection: sel });

    }
    if (onSelection) {
      onSelection(sel, {startMillis, endMillis, text});
    }
  };
  onLoadSnippet = (data, snippet, i) => {
    const {snippets} = this.state;
    const copy = snippets.slice();


    const words = this.getWordsForSnippetDuration(data, snippet);
    copy.splice(i, 1, {
      ...snippet,
      index: i,
      data,
      words,
    });
    this.setState({snippets: copy});
    setTimeout(() => {
      this.forceUpdate();
    }, 100);

  };

  resetSnippets = (currentMinute) => {
    const { duration } = this.props;
    let pre = 5;
    const post = 5;
    const startTime = getMinute(currentMinute, pre * -1);
    if (startTime === '00:00:00') {
      pre = 0;
    }
    const {snippets} = this.state;
    const index = snippets.findIndex(sn => sn.minute === currentMinute);
    if (index > -1) {
      this.setState({snippets: [snippets[index]], selection: [[], []]});
    } else {
      const snippet = {
        minute: startTime,
        duration,
        pre,
        post
      };
      this.setState({snippets: [snippet], selection: [[], []]});
    }
  };
  hasFirstSnippet = () => {
    const { snippets } = this.state;
    if (snippets.length === 0) return false;
    const first = snippets[0] || {};
    return first.minute === '00:00:00';
  };
  render() {
    const {
      disabled,
      episode
    } = this.props;

    const {snippets, selection} = this.state;
    return (
      <Wrapper>
        <Snippets ref={this.scrollRef}>
          {!disabled && snippets.map((snippet, i) => {
            return <SnippetLoader
              key={`${snippet.minute}:${i}`}
              snippet={snippet}
              episode={episode}
              selection={selection}
              onPressWord={(word) => this.setSelection({word, snippet, i})}
              onLoad={(data) => this.onLoadSnippet(data, snippet, i)}
            />
          })}
        </Snippets>
      </Wrapper>
    );
  }
}


SnippetManager.propTypes = {
  disabled: PropTypes.bool,
  minute: PropTypes.string,
  duration: PropTypes.number,
  episodeDuration: PropTypes.number,
  onSelection: PropTypes.func,
  episode: PropTypes.shape({})
};

export default SnippetManager;

const Wrapper = styled.View`
height: 100%;
`;

const Snippets = styled.ScrollView`
flex:1;
z-index:10;
`;
