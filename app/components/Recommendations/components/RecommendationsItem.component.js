import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import styled from 'styled-components/native';
import variables from '../../styles/variables';

const Wrapper = styled(TouchableOpacity)`
  margin-right: ${variables.M_4}px;
  width: ${({ width = 75 }) => width}px;
  max-height: 145px;
  overflow:hidden;
`;

const Img = styled(ImageLoad)`
  width: ${({size}) => size }px;
  height: ${({size}) => size }px;
  margin-bottom:${variables.MB_2}px;
  ${({borderRadius}) => borderRadius ? `border-radius: ${borderRadius}` : ''}
`;

const Title = styled.Text`
font-size: ${variables.FONT_SIZE_H5};
color: ${variables.FONT_COLOR_SUBTLE};
margin-bottom:${variables.MB_1}px;
`;

const SubTitle = styled.Text`
font-size: ${variables.FONT_SIZE_H5};
color: ${variables.FONT_COLOR_SUBTLE}
`;

export default class RecommendationsItem extends Component {

  render() {
    const { image, size = 75, borderRadius = 0, title, subTitle, onPress } = this.props;
    return (
      <Wrapper width={size + 10} onPress={onPress}>
        <Img borderRadius={borderRadius} size={size} source={{ uri: image }} />
        <Title>{title}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </Wrapper>
    );
  }
}

RecommendationsItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  borderRadius: PropTypes.number,
  image: PropTypes.string,
  onPress: PropTypes.func,
  size: PropTypes.number,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
};

