import React from 'react';
import {shape, string, number, func, bool} from 'prop-types';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native'
import {MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons';
import { Grid } from '../../../components/styles';
import variables from '../../../components/styles/variables';

const { Row, Col } = Grid;

export const AltClipItemCell = ({ item, index, height, onPress, isActive }) => {

  return (
    <AltClipItem
      onPress={() => onPress({ clip: item })}
      height={height}
      key={index}
      isFirst={index === 0}
    >
      <Row style={{height}} alignItems="center">
        <Col>
          <Icon name="scissors-cutting" size={24} color={variables.BORDER_COLOR_DARK} />
        </Col>
        <TextCol flex={1}>
          <AltClipItemText isActive={isActive}>{item.title}</AltClipItemText>
          <AltClipItemText>{item.startToFinish}</AltClipItemText>
        </TextCol>
        <Col justifyContent="center" style={{marginRight: 15}} alignItems="center">
          <LikeIcon name="thumbs-o-up" size={18} color={variables.BORDER_COLOR_DARK} />
          <LikeText>{item.likes}</LikeText>
        </Col>

      </Row>
    </AltClipItem>
  );
};

const Icon = styled(MaterialCommunityIcons)`
margin:0 20px;
`;

const LikeIcon = styled(FontAwesome)`
margin:0 5px;
`;

const LikeText = styled.Text`
margin: 0 5px;
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5}px;
`;

const TextCol = styled(Col)`
margin: ${variables.M_2}px 0;
`;

const AltClipItemText = styled.Text`
color: ${({ isActive }) => isActive ? variables.ACTIVE_COLOR : variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H4};
`;

const AltClipItem = styled(TouchableOpacity)`
height: ${({ height }) => height}px;
background-color: ${variables.LIGHT_BG};
flex:1;
`;

AltClipItemCell.propTypes = {
  item: shape({
    title: string
  }),
  index: number,
  onPress: func,
  height: number,
  isActive: bool
};
