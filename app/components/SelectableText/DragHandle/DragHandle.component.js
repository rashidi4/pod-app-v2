import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
// import { TouchableOpacity } from 'react-native';
// import variables from '../styles/variables';
import { Entypo } from '@expo/vector-icons';
import variables from '../../styles/variables';

// background-color: #FF0000;
// opacity: 0.4;

const Wrapper = styled.View`
position:absolute;
top: ${({ top }) => top }px;
left: ${({ left }) => left }px;
width: ${({ height }) => height}px;
height: ${({ height }) => height}px;
z-index: 1000;
align-items:center;

`;

const Line = styled.View`
width:2px;
background-color: ${variables.ACTIVE_COLOR};
height: ${({ height}) => height}px;
`;

export default class DragHandle extends Component {

  state = {
    padSize: this.props.word.layout.height * 2
  };

  getPosition = () => {
    const { word = {}, direction = 'down' } = this.props;
    const { layout } = word;
    const { padSize } = this.state;
    if (direction === 'up') {
      const left = layout.x + layout.width - (padSize/2);
      const top = layout.y;
      return { left, top };

    }

    const left = layout.x - padSize/2;
    const top = layout.y - (padSize/2);


    return { left, top };

  };

  render() {
    const { direction, word: { layout } } = this.props;
    const { left, top } = this.getPosition();
    const { padSize } = this.state;
   const sty = direction === 'up'
    ? {}
    : { transform: [{scaleY: -1}]};
    return (
      <Wrapper left={left} top={top} height={padSize} style={sty}>
        <Line height={layout.height} />
        <Entypo
          name="dot-single"
          size={50}
          color={variables.ACTIVE_COLOR}
          style={{ width:50,height: 50, marginTop: -23 }}
        />
      </Wrapper>
    );
  }
}

DragHandle.propTypes = {
  word: PropTypes.shape({
    layout: PropTypes.shape({
      height: PropTypes.number
    })
  }),
  direction: PropTypes.string
};