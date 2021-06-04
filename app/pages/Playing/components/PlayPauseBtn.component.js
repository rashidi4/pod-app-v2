import React, {useEffect, useState, useCallback} from 'react';
import Player from '../../../components/Player';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';
import {MaterialIcons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import BigLoader from '../../../components/Loaders/Spinner.component';

function getStatus(playbackStatus) {
  return playbackStatus.isLoaded;
}

function PlayPauseBtn({small = false, style = {}, disabled = false, onBeforePress }) {

  const [isLoading, setIsLoading] = useState(false);

  const [{isReady = false, shouldPlay = false}, setStatus] = useState({
    isReady: getStatus(Player.playbackStatus),
    shouldPlay: Player.playbackStatus.shouldPlay
  });
  const {episode} = Player;
  const _onPress = useCallback(() => {
      if (onBeforePress) {
        onBeforePress();
      }
      const {playbackStatus} = Player;
      if (playbackStatus.isLoaded) {
        Player.setStatusAsync({shouldPlay: !playbackStatus.shouldPlay});
      }
    }, [episode?.id]);

  const cb = (playbackStatus) => {
    if (playbackStatus) {
      const isReady = getStatus(playbackStatus);

      setStatus({
        isReady,
        shouldPlay: playbackStatus.shouldPlay
      })
    }
  };

  const onLoad = (ready) => {
    setIsLoading(!ready);
  };

  useEffect(() => {
    Player.onEvent('shouldPlay', cb);
    Player.onEvent('onLoad', onLoad);
    // Player.onEvent('pause', cb);
    return () => {
      Player.offEvent('shouldPlay', cb);
      // Player.offEvent('pause', cb);
      Player.offEvent('onLoad', onLoad);
    }
  }, []);
  const showLoader = !isReady || isLoading;
  return (
    <PlayButton small={small} onPress={_onPress} disabled={!isReady || disabled} style={style}>
      {showLoader && <BigLoader size={small ? 20 : 40}/>}
      {!showLoader && shouldPlay &&
      <MaterialIcons size={small ? 40 : 80} name="pause-circle-filled" style={playStyle}/>
      }
      {!showLoader && !shouldPlay &&
      <MaterialIcons size={small ? 40 : 80} name="play-circle-filled" style={playStyle}/>
      }
    </PlayButton>
  )
}

PlayPauseBtn.propTypes = {
  small: PropTypes.bool,
  style: PropTypes.shape({}),
  disabled: PropTypes.bool,
  onBeforePress: PropTypes.func
};


const PlayButton = styled(TouchableOpacity)`
shadow-opacity: 0.3;
shadow-radius: 4px;
shadow-color: #000;
shadow-offset: -2px 2px;
elevation:1;
justify-content: center
height:${({small}) => small ? 40 : 80}px;
opacity: ${({disabled}) => disabled ? 0.3 : 1};
min-width:40px; 
align-items:center;
`;

const playStyle = {
  color: variables.ACTIVE_COLOR,
  height: '100%',
  width: '100%'
};


export default PlayPauseBtn;
