import React, { useEffect, useState } from 'react';
import {string, func, shape, any} from 'prop-types';
import { useQuery} from '@apollo/client';
import styled from 'styled-components/native';
import {SelectableText} from './SelectableText';
import {SelectionControls} from './SelectionControls/SelectionControls';
import gql from 'graphql-tag';
import variables from '../../../components/styles/variables';
import {TextModel} from './TextModel';


const TRANSCRIPTION_QUERY = gql`
  query Transcription($episodeId: ID!) {
      episode(episodeId: $episodeId) {
          transcription {
              transcript
              words {
                  speakerTag
                  word
                  startTime
                  endTime
              }
          }
      }
  }
`;


const useActiveMinutes = ({ episodeId, initialMinute = '00:00:00' }) => {
  // the entire transcription
  const [transcription, setTranscription] = useState(null);
  const [selection, setSelection] = useState({ start: null, end: null });
  const { data, error } = useQuery(TRANSCRIPTION_QUERY, {variables: { episodeId }});
  if (error) {
    console.log(error);
  }
  const [activeMinutes, setActiveMinutes] = useState([initialMinute]);
  const text = new TextModel(transcription, activeMinutes, selection);
  useEffect(() => {
    if (data && data.episode) {
      setTranscription(data.episode.transcription);
    }
  }, [data]);

  const toggleMarker = (minute, pressedIndex) => {
    const ret = activeMinutes.slice();
    const index = activeMinutes.indexOf(minute);
    const { markerIndexes: { first, last = first }, markers } = text;
    if (index > -1) {
      if (pressedIndex === first || pressedIndex === last) {
        ret.splice(index, 1);
      } else {
        const rightSide = Math.abs(last - pressedIndex);
        const leftSide = Math.abs(first - pressedIndex);
        const start = leftSide > rightSide
          ? first
          : pressedIndex + 1;

        const end = leftSide > rightSide
          ? pressedIndex - 1
          : last;
        ret.length = 0;
        for (let i = start; i <= end; i++) {
          ret.push(markers[i].secondsText);
        }
      }
    } else {
      // console.log(first, last);
      if (pressedIndex > first && pressedIndex > last) {
        for (let i = first + 1; i <= pressedIndex; i++) {
          ret.push(markers[i].secondsText);
        }
      }
      if (pressedIndex < first) {
        for (let i = pressedIndex; i < first; i++) {
          ret.push(markers[i].secondsText);
        }
      }
      ret.push(minute);
    }
    const set = new Set(ret);

    setActiveMinutes(Array.from(set));
  };

  return [text, {toggleMarker, setSelection}];
};


export const EditText = ({ episode, currentMinute, onSelection, textRef }) => {
  // const [text, setText] = useState('');
  const [text, { toggleMarker, setSelection }] = useActiveMinutes({ episodeId: episode.id, currentMinute });
  const {selectedText} = text;
  const handleMarkerPress = ({ marker, index }) => {
    toggleMarker(marker.secondsText, index)
  };

  const handleSelectionChange = ({ start, end}) => {
    setSelection({ start, end });
  };

  useEffect(() => {
    if (onSelection) {
      onSelection(text);
    }
  }, [selectedText]);

  const {markers} = text;
  return (
    <Wrapper>
      <SelectableTextWrapper>
        <SelectableText textRef={textRef} text={text.text} textObj={text} onSelectionChange={handleSelectionChange} />
      </SelectableTextWrapper>
      <SelectionControls markers={markers} onPressMarker={handleMarkerPress} />
    </Wrapper>
  );

};

EditText.propTypes = {
  textRef: shape({ current: any }),
  episode: shape({
    id: string,
  }),
  currentMinute: string,
  onSelection: func
};

const Wrapper = styled.View`
  flex:1;
  justify-content: space-between;
 
`;

const SelectableTextWrapper = styled.View`
flex:1;
margin: 0 ${variables.M_2}px;
`;

