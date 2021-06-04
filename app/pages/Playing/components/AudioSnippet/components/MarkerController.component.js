import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import variables from '../../../../../components/styles/variables';

const getPositionLeft = ({ clip, durationMillis, barWidth }) => {
  const percent = (clip.startMillis / durationMillis);
  const ret = percent * barWidth;
  if (isNaN(ret)) return 0;
  return ret;
};

const MarkerController = ({ clip, activeClip, durationMillis, barWidth }) => {
  const left = getPositionLeft({ clip, durationMillis, barWidth});

  if (activeClip && clip.id === activeClip.id) {
    return (
      <Marker>
        <MaterialCommunityIcons
          style={{...styles.markerSelectedBG, left: left - 6}}
          name="circle" size={22}
          color={variables.ACTIVE_COLOR}
        />
        <MaterialCommunityIcons
          style={{...styles.markerSelected, left }}
          name="circle-slice-8"
          size={10}
          color={variables.LIGHT_BLUE}
        />
      </Marker>
    )
  }

  return (
    <Marker>
      <MaterialCommunityIcons
        style={{...styles.marker, left }}
        name="circle-medium"
        size={12}
        color={variables.LIGHT_BLUE}
      />
    </Marker>
  )
};

MarkerController.propTypes = {
  clip: PropTypes.shape({
    id: PropTypes.string,
    startMillis: PropTypes.number
  }),
  activeClip: PropTypes.shape({
    id: PropTypes.string,
  }),
  durationMillis: PropTypes.number,
  barWidth: PropTypes.number
};

export default MarkerController;

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 0,
  },
  markerSelected: {
    position: 'absolute',
    top: 1
  },
  markerSelectedBG: {
    position: 'absolute',
    top: -5
  }
});


const Marker = styled.View`

`;
