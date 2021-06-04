import React, {useRef, useState, useCallback, useImperativeHandle} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import SnippetManager from './SnippetManager';
import {MaterialIcons} from '@expo/vector-icons';
import PlayPauseBtn from '../PlayPauseBtn.component';
import CutClipBtn from './CutClipBtn.component';
import variables from '../../../../components/styles/variables';
import Player from '../../../../components/Player';


const SnippetCreating = (props) => {
  const { visible, episode, currentMinute, isOpen, onPressCutClip, onSelectionChange, forwardedRef } = props;
  const [{selection = [] }, setSelection] = useState({});
  const [, updateState] = React.useState();

  const forceUpdate = useCallback(() => updateState({}), []);
  const snippetRef = useRef(null);

  useImperativeHandle(forwardedRef, () => ({
    resetSnippets: () => {
      snippetRef.current.resetSnippets(currentMinute);
    }
  }));

  const previousSnippet = async () => {
    if (snippetRef && snippetRef.current) {
      await snippetRef.current.previous();
      forceUpdate();
    }
  };

  const nextSnippet = async () => {
    if (snippetRef && snippetRef.current) {
      await snippetRef.current.next();
      forceUpdate();
    }
  };

  const onWordSelectionChange = (selection, {startMillis, endMillis, text}) => {
    setSelection({selection, startMillis, endMillis});
    if (typeof startMillis === 'number') {
      Player.setPosition(startMillis);
    } else {
      Player.pause();
    }
    onSelectionChange(selection, {startMillis, endMillis, text});
  };

  const hasSelection = (sel) => {
    const selection = sel || selection;
    const [start, end] = selection || [];
    if (typeof start === 'undefined') return false;
    if (typeof end === 'undefined') return false;

    return (start[0] > -1 && end[0] > -1);
  };

  const onPress = () => {
    onPressCutClip(selection);
  };

  const hasSelections = hasSelection(selection);
  const previousDisabled = snippetRef && snippetRef.current && snippetRef.current.hasFirstSnippet();
  return (
  <Wrapper visible={visible}>
    <PodcastTextWrapper>
      <Notepad>
        <SnippetManager
          ref={snippetRef}
          disabled={!isOpen}
          minute={currentMinute}
          episode={episode}
          feedUri={episode.feedUri}
          uri={episode.audio.uri}
          redirectUri={episode.audio.redirectUri}
          episodeDuration={episode.audio.durationMillis}
          duration={15}
          onSelection={onWordSelectionChange}
        />
      </Notepad>
    </PodcastTextWrapper>
    <AlignBottom>
      <ActionWrapper>
        <Empty size={50}/>
        <CenterControls>
          <Pill>
            <PillItem>
              <Rewind onPress={previousSnippet} disabled={previousDisabled}>
                <MaterialIcons size={30} name="navigate-before"/>
              </Rewind>
            </PillItem>
            <PillItem>
              <FastForward onPress={nextSnippet}>
                <MaterialIcons size={30} name="navigate-next"/>
              </FastForward>
            </PillItem>
          </Pill>
          <PlayPauseBtn
            disabled={!hasSelections}
            style={{marginTop: -65}}
          />
        </CenterControls>
        <CutClipBtn
          active={hasSelections}
          onPress={onPress}
        />
      </ActionWrapper>
    </AlignBottom>
  </Wrapper>
  );
};

SnippetCreating.propTypes = {
  episode: PropTypes.shape({
    feedUri: PropTypes.string,
    audio: PropTypes.shape({
      uri: PropTypes.string,
      redirectUri: PropTypes.string,
      durationMillis: PropTypes.number,
    }),
  }),
  visible: PropTypes.bool,
  currentMinute: PropTypes.string,
  previousDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  hasSelections: PropTypes.bool,
  onPressCutClip: PropTypes.func,
  onSelectionChange: PropTypes.func,
  forwardedRef: PropTypes.shape({}),
};

SnippetCreating.defaultProps = {
  onSelectionChange: () => {}
};

export default SnippetCreating;

const Wrapper = styled.View`
${({visible}) => visible ? '' : 'display:none;'};
flex:1;
`;


const PodcastTextWrapper = styled.View`
flex:1;
flex-direction: row;
`;

const Notepad = styled.View`
flex:1;
margin-bottom: 10px;
`;


const ActionWrapper = styled.View`
margin-top: ${variables.M_3}px;
flex-direction: row;
justify-content: space-between
align-items: flex-start;
width: 100%;
`;


const AlignBottom = styled.View`
align-items:center;
border: 1px;
border-color: ${variables.BORDER_COLOR_DARK};
border-radius: 5px;
background-color: ${variables.BACKGROUND_BG}
margin-bottom: 10px;
`;

const Pill = styled.View`
  background-color: ${variables.WHITE};
  width: 200px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 25px;
  `;

const PillItem = styled.View`
  `;

const CenterControls = styled.View`
  align-items:center;

  `;

const Rewind = styled(TouchableOpacity)`
  margin-left: 20px;
  opacity: ${({disabled}) => disabled ? 0.3 : 1};
  `;

const FastForward = styled(TouchableOpacity)`
  margin-right: 20px
  `;


const Empty = styled.View`
  width: ${({size}) => size}px;
  `;
