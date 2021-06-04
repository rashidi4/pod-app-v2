import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import styled from 'styled-components/native';
import variables from '../styles/variables';

const NOOP = () => {
};

// const BGWrapper = styled.View`
//
// flex: 1;
// position:absolute;
// height: 100px;
// width: 100%;
// height: ${({ height }) => height}px;
// top: ${({ top }) => top}px;
// `;

const BGWrapper = ({firstWord, lastWord, selection }) => {
  if (!firstWord.layout || !lastWord.layout) return null;

  let r2 = {backgroundColor: variables.LIGHT_BLUE};

  if (!selection || selection.length === 0) return null;


  if (firstWord.layout.y === lastWord.layout.y && selection[0][0] === selection[1][0]) {
    // if its the same line
    r2.width = lastWord.layout.x - firstWord.layout.x + lastWord.layout.width;
  } else if (selection[0][0] !== selection[1][0]) {
    r2.width = lastWord.layout.x - firstWord.layout.x + lastWord.layout.width;
  } else {
    r2.flex = 1;
  }

  return (
    <View style={{position: 'absolute', width: '100%'}}>
      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        top: firstWord.layout.y,
        height: firstWord.layout.height,
        width: '100%'
      }}>
        <View
          style={{
            backgroundColor: variables.WHITE,
            width: firstWord.layout.x}}
        />
        <View
          style={r2}
        />
      </View>

      <View style={{
        position: 'absolute',
        width: '100%',
        backgroundColor: variables.LIGHT_BLUE,
        top: firstWord.layout.y + firstWord.layout.height,
        height: Math.max(lastWord.layout.y - firstWord.layout.y - lastWord.layout.height, 0)
      }}/>

      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        top: lastWord.layout.y,
        height: lastWord.layout.y !== firstWord.layout.y
          ? lastWord.layout.height
          : 0,
        width: '100%'
      }}>
        <View style={{
          width: lastWord.layout.x + lastWord.layout.width,
          backgroundColor: variables.LIGHT_BLUE
        }}/>
        <View style={{flex: 1, backgroundColor: variables.WHITE}}/>
      </View>
    </View>
  )
};

BGWrapper.propTypes = {
  firstWord: PropTypes.shape({
    layout: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      height: PropTypes.number,
      width: PropTypes.number,
    }),
  }),
  lastWord: PropTypes.shape({
    layout: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      height: PropTypes.number,
      width: PropTypes.number,
    }),
  }),
  selection: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number
    )
  ),
};

const Text = ({onPress, word, isSelected = false, onLayout = NOOP, color, backgroundColor}) => {

  const TextType = isSelected
    ? SelectedText
    : DefaultText;

  return (
    <TextType
      color={color}
      backgroundColor={backgroundColor}
      onLayout={(e) => onLayout(e, word)}
      onPress={(e) => onPress(e, word)}
    >
      {word.word}{' '}
    </TextType>
  )
};

Text.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  onPress: PropTypes.func,
  onLayout: PropTypes.func,
  isSelected: PropTypes.bool,
  word: PropTypes.shape({
    word: PropTypes.string,
    index: PropTypes.number,
  }),
};

export default class SelectableText extends Component {

  constructor(props) {
    super(props);
    this.layouts = {};
  }

  componentDidMount() {
    this.init(this.props);
  }

  componentDidUpdate(previousProps) {
    if (!previousProps.words && this.props.words) {
      this.init(this.props);
    }
  }

  init() {

    const words = this.getWords();
    if (words && words.length) {
      this.words = words;
    }

  }

  getWords = () => {
    const {words} = this.props;
    return (words || []).map((word, index) => {
      return {
        ...word,
        index,
        isSelected: false
      }
    });
  };

  onLayout = (e, word) => {
    this.layouts[word.index] = e.nativeEvent.layout
  };

  handlePress = (e, word) => {
    const { onPress } = this.props;
    if (onPress) {
      onPress(word);
    }
  };

  isWordSelectAtIndex = (index) => {
    const { firstWordIndex, lastWordIndex } = this.getSelections();

    if (index > firstWordIndex && index < lastWordIndex) {
      return true
    }
    return false;
  };

  getSelections = () => {
    const {index, words} = this.props;
    const [start, end] = this.props.selection || [];
    let firstWordIndex;
    let lastWordIndex;
    if (index === start[0]) {
      firstWordIndex = start[1];
    } else if (index > start[0]) {
      firstWordIndex = 0;
    }
    if (index === end[0]) {
      lastWordIndex = end[1];
    } else if (index < end[0] && words) {
      lastWordIndex = words.length - 1;
    }
    return {
      firstWordIndex,
      lastWordIndex,
    };
  };

  isFirstWordSelected = (word) => {
    const {firstWordIndex} = this.getSelections();
    const { index, selection } = this.props;
    const [start] = selection;
    if (typeof firstWordIndex === 'undefined' || firstWordIndex === -1) return false;
    return word.index === firstWordIndex && start[0] === index;
  };

  render() {
    const words = this.getWords();
    const {selection, index} = this.props;
    const { firstWordIndex, lastWordIndex } = this.getSelections();

    const firstWord = words[firstWordIndex];
    if (firstWord) {
      firstWord.layout = this.layouts[firstWordIndex];
    }

    const lastWord = words[lastWordIndex];
    if (lastWord) {
      lastWord.layout = this.layouts[lastWordIndex];
    }

    return (
      <Wrapper renderToHardwareTextureAndroid={true}>
        {firstWord && lastWord && <BGWrapper
          firstWord={firstWord}
          lastWord={lastWord}
          selection={selection}
          index={index}

        />}
        {(words || []).map((word, n) => (
          <Text
            key={n}
            word={word}
            backgroundColor={this.isFirstWordSelected(word) ? variables.LIGHT_BLUE : ''}
            isSelected={this.isWordSelectAtIndex(word.index)}
            selectable={true}
            onPress={this.handlePress}
            onLayout={this.onLayout}
          />
        ))}
      </Wrapper>
    );
  }
}

SelectableText.propTypes = {
  text: PropTypes.string,
  hidden: PropTypes.bool,
  duration: PropTypes.number,
  words: PropTypes.arrayOf(PropTypes.shape({
    endTime: PropTypes.shape({
      seconds: PropTypes.number,
      millis: PropTypes.number,
    })
  })),
  pre: PropTypes.number,
  post: PropTypes.number,
  mode: PropTypes.string,
  onPress: PropTypes.func,
  selection: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number
    )
  ),
  index: PropTypes.number,
};


const Wrapper = styled.View`
flex-direction: row;
flex-wrap: wrap;
`;

const DefaultText = styled.Text`
font-size: 14px;
color: ${({color = '#000000'}) => color};
${({ backgroundColor }) => backgroundColor ? `background-color:${backgroundColor};` : ''}
`;

const SelectedText = styled.Text`
font-size: 14px;
color: ${({color = '#000000'}) => color};
${({ backgroundColor }) => backgroundColor ? `background-color:${backgroundColor};` : ''}
background-color: ${variables.LIGHT_BLUE};
`;

