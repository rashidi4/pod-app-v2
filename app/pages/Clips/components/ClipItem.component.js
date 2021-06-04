import React from 'react';
import { shape, func } from 'prop-types';
import styled from 'styled-components/native';
import {Image, Dimensions, TouchableOpacity} from 'react-native';
import variables from '../../../components/styles/variables';

const ClipItem = ({ clip, onPress }) => {

  const {width} = Dimensions.get('window');

  const imageUri = clip.episode.image.uri
    ? clip.episode.image.uri
    : clip.podcast.image.uri;

  const size = (width / 2) - 25;

  // @todo -7 hack
  return (
    <Wrapper maxWidth={((width / 2) - 7)} onPress={() => onPress ? onPress({ clip }) : null}>
      <Img size={size} source={{uri: imageUri}} />
      <Bg size={size}>

        <Title>
          {clip.title}
        </Title>
        <Author>{clip.podcast.title}</Author>
      </Bg>
    </Wrapper>
  );
};

ClipItem.propTypes = {
  clip: shape({}),
  onPress: func,
};

const Wrapper = styled(TouchableOpacity)`
flex:1;
align-items:center;
margin: 0 0 20px;
max-width: ${({ maxWidth }) => maxWidth}px;
`;

const Img = styled(Image)`
width: ${({ size }) => size }px;
height: ${({ size }) => size }px;
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK};
border-width:1px;
`;

const Title = styled.Text`
color: ${variables.LIGHT_BLUE};
font-weight: bold;
`;
const Author = styled.Text`
color: ${variables.LIGHT_BLUE};
font-size: ${variables.FONT_SIZE_H4}px;
`;

const Bg = styled.View`
position:absolute;
width: ${({size }) => size}px;
height: ${({size }) => size}px;
backgroundColor: rgba(0,0,0,0.7)
width: ${({ size }) => size }px;
height: ${({ size }) => size }px;
border-radius: 5px;
justify-content: flex-end;
padding: 0 0 10px 10px;
`;

export default ClipItem;
