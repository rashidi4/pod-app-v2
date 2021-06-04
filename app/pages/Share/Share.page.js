import React, { useCallback, useState, useEffect, useRef } from 'react'
import {shape, func} from 'prop-types';
import {Platform, StatusBar} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import styled from 'styled-components/native';
import {PageWrapper} from '../../components/styles';
import variables from '../../components/styles/variables';
import {EditText} from './components/EditText.tab';
import Player, { useCurrentMinute } from '../../components/Player';
import SnippetPreview from './components/SnippetPreview.component';
import SnippetForm from './components/SnippetForm.component';

export const SharePage = ({ navigation }) => {
  const episode = navigation.getParam('episode', null);
  const podcast = navigation.getParam('podcast', null);
  const textRef = useRef(null);
  const currentMinute = useCurrentMinute();
  const [text, setText] = useState('');
  const [millis, setMillis] = useState({
    endMillis: null,
    startMillis: null
  });
  const updateStatusBar = useCallback(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.WHITE);
  }, []);

  const handleSelection = useCallback((text) => {
    const { selectedText } = text;
    if (Platform.OS === 'ios' && !selectedText) return;
    setText(text.selectedText);
    // startPosition
    const { startMillis, endMillis } = text.selectedMillis;
    if (startMillis) {
      Player.setPosition(startMillis);
    }
    setMillis({startMillis, endMillis });
  }, []);

  const { endMillis, startMillis } = millis;

  // hook to start the player again
  useEffect(() => {
    const updatePositionMillis = (playbackStatus) => {
      const { positionMillis } = playbackStatus;
      if (typeof endMillis !== 'number') return;
      if (typeof startMillis !== 'number') return;
      if (!positionMillis) return;
      if (positionMillis >= endMillis) {
        Player.pause().then(() => {
          Player.setPosition(startMillis);
        });
      }
    };
    Player.on(updatePositionMillis);
    return () => {
      Player.off(updatePositionMillis);
    }
  }, [endMillis, startMillis]);

  useEffect(() => {
    Player.loadBucketPath();
  }, []);

  const handleSubmit = useCallback(() => {
    // console.log('submitted!');
    navigation.goBack();
  }, []);

  const handleError = useCallback(() => {
    console.log('error!');
  }, []);

  const handleDelete = useCallback(() => {
    setText('');
    setMillis({startMillis: null, endMillis: null });
    console.log(textRef);
    if (textRef && textRef.current) {
      const selection = { start: 0, end: 0 };
      textRef.current.setNativeProps({ selection })
    }
  }, []);

  return (
    <>
      <NavigationEvents onDidFocus={updateStatusBar}/>
      <PageWrapper bg={variables.WHITE}>
        <EditText
          textRef={textRef}
          onSelection={handleSelection}
          episode={episode}
          currentMinute={currentMinute}
        />

        <AudioController>

          <SnippetForm
            millis={millis}
            episode={episode}
            podcast={podcast}
            onSuccess={handleSubmit}
            onError={handleError}
          >
            <SnippetPreview
              onPressDelete={handleDelete}
              visible={true}
              text={text}
            />
          </SnippetForm>
        </AudioController>
      </PageWrapper>
    </>
  )
};

SharePage.propTypes = {
  navigation: shape({
    getParam: func
  })
};

SharePage.navigationOptions = () => ({
  title: 'Share Clip',
  headerShown: true,
  headerStyle: {
    backgroundColor: variables.WHITE,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    boxShadow: 'none'
  }
});

const AudioController = styled.View`
flex:1;
`;


