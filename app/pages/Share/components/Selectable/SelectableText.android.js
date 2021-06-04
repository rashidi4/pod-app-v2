import React, { useState, useCallback, useEffect } from 'react';
import {ScrollView} from 'react-native';
import {string, func, shape} from 'prop-types';
import styled from 'styled-components/native';
import variables from '../../../../components/styles/variables';


const useSelectableText = (props) => {

  const [charSelection, setCharSelection] = useState({ start: null, end: null });
  const [selection, setSelection] = useState({ firstWordIndex: null, lastWordIndex: null });

  const words = props.textObj ? props.textObj.toStringObj : [];

  const handlePress = useCallback((word) => {
    // both are selected, reset

    if (selection.firstWordIndex && selection.lastWordIndex) {
      setSelection({ firstWordIndex: null, lastWordIndex: null });
    } else if (selection.firstWordIndex && !selection.lastWordIndex) {
      // send word selected
      if (word.index < selection.firstWordIndex) {
        setSelection({firstWordIndex: word.index, lastWordIndex: selection.firstWordIndex });
      } else {
        setSelection({firstWordIndex: selection.firstWordIndex, lastWordIndex: word.index });
      }

    } else {
      //first word
      setSelection({firstWordIndex: word.index, lastWordIndex: null });
    }
  }, [selection]);

  useEffect(() => {

    const firstWord = words[selection.firstWordIndex];
    const lastWord = words[selection.lastWordIndex];

    const start = firstWord
      ? firstWord.charStart
      : null;

    let end = lastWord
      ? lastWord.charStart + lastWord.len
      : null;

    setCharSelection({ start, end });
  }, [selection]);


  return [words, {handlePress}, charSelection, selection];
};

export const SelectableTextAndroid = ({ text, textObj, onSelectionChange }) => {

  const [words, {handlePress}, selection, wordSelection] = useSelectableText({text, textObj});
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({nativeEvent: { selection } });
    }
  }, [selection]);
  return (
    <ScrollView>
      <Wrapper>
        {words.map((word, i) => {
          return (<Text
              key={i}
              index={i}
              onPress={() => handlePress(word)}
              isMarker={word.isMarker}
              backgroundColor={word.isSelected || i === wordSelection.firstWordIndex ? variables.LIGHT_BLUE : null}
          >
              {word.word}
            </Text>);
        })}
      </Wrapper>
    </ScrollView>
  );
};


SelectableTextAndroid.propTypes = {
  text: string,
  textObj: shape({}),
  onSelectionChange: func,
};

const Wrapper = styled.View`
flex-direction: row;
flex-wrap: wrap;
`;

const Text = styled.Text`
margin-top: ${({isMarker, index}) => isMarker && index > 0 ? 20 : 0};
margin-bottom: ${({isMarker}) => isMarker ? 5 : 0};
${({isMarker}) => isMarker ? 'width:100%;' : ''}
${({ backgroundColor }) => backgroundColor ? `background-color:${backgroundColor};` : ''}
color: ${({color = '#000000'}) => color};
`;

