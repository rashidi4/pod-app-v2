import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {Image, Platform} from 'react-native';
import { Shadow } from '../../styles';
import variables from '../../styles/variables';



const AlbumCoverView = styled(Image)`
  width: ${({size}) => size }px;
  height: ${({size}) => size }px;
  ${({borderRadius}) => borderRadius ? `border-radius: ${borderRadius}` : ''}
  ${({border}) => border ? 'border-width: 1px' : ''}
  ${({border}) => border ? `border-color: ${variables.BORDER_COLOR_DARK}` : ''}
  
  
`;


const AlbumCover = ({ size = 75, shadow = false,  uri, borderRadius = 0, border = false, style }) => {
  const comp = <AlbumCoverView size={size} borderRadius={borderRadius} border={border} source={{uri}} style={style}/>;
  if (shadow && Platform.OS === 'ios') {
    return <Shadow>{comp}</Shadow>
  }
  return comp;
};

AlbumCover.propTypes = {
  size: PropTypes.number,
  uri: PropTypes.string,
  shadow: PropTypes.bool,
  borderRadius: PropTypes.number,
  style: PropTypes.shape({})
};


export default AlbumCover;
