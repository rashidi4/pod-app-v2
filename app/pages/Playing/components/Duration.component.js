import React, { useEffect, useState } from 'react';
import Player from '../../../components/Player';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';
import {millisToString} from '../../../util';

export const Text = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5};
font-weight: bold;
`;

function Duration() {
  const [ position, setPosition ] = useState(
    millisToString(Player.playbackStatus.positionMillis)
  );
  const cb =  (playbackStatus) => {
    const p = millisToString(playbackStatus.positionMillis);
    if (p) {
      setPosition(p);
    }

  };
  useEffect(() => {

    Player.on(cb);
    return () => {
      Player.off(cb);
    }
  }, []);
  return (<Text>{position}</Text>);
}


export default Duration;
