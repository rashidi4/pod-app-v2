import React, {useCallback, useState, useEffect} from 'react';
import { TextInput, Platform } from 'react-native';
import {string, bool, arrayOf, shape, number, func, any} from 'prop-types';
import styled from 'styled-components/native';
import { SelectableTextAndroid } from './Selectable/SelectableText.android';


export const SelectableText = (props) => {
  const { onSelectionChange, textRef } = props;
  const [text, setText] = useState(props.text);

  useEffect(() => {
    setText(props.text)
  }, [props.text]);

  const _onSelectionChange = useCallback((event) => {
    const {nativeEvent: {selection: {start, end}}} = event;
    if (onSelectionChange) {
      onSelectionChange({ start, end });
    }
  }, []);

  return (
    <Wrapper>
      {Platform.OS === 'android' &&
        <SelectableTextAndroid
          text={text}
          textObj={props.textObj}
          onSelectionChange={_onSelectionChange}
        />
      }
      {Platform.OS === 'ios' &&
      <TextInput
        ref={textRef}
        value={text}
        multiline
        contextMenuHidden={true}
        editable={false}
        onSelectionChange={_onSelectionChange}
      />
      }
    </Wrapper>
  );
};

SelectableText.propTypes = {
  text: string,
  textObj: shape({}),
  textRef: shape({ current: any }),
  hidden: bool,
  duration: number,
  words: arrayOf(shape({
    endTime: shape({
      seconds: number,
      millis: number,
    })
  })),
  pre: number,
  post: number,
  mode: string,
  onPress: func,
  selection: arrayOf(
    arrayOf(
      number
    )
  ),
  index: number,
  onChangeText: func,
  onSelectionChange: func,
};

const Wrapper = styled.View`
`;
