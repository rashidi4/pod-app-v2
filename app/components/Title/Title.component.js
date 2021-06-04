import React, { Component } from 'react';
import PropTypes from 'prop-types';
import variables from '../styles/variables';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  alignItems: center;
  margin: 20px 0;
`;

const PrimaryText = styled.Text`
  fontSize: ${variables.FONT_SIZE_H1};
  color: ${({ color }) => color ? color : variables.FONT_COLOR_DARK};
  fontWeight: ${variables.FONT_WEIGHT_BOLDER}
`;

const SubText = styled.Text`
  fontSize: ${variables.FONT_SIZE_H5};
  color: ${variables.FONT_COLOR_SUBTLE}
`;

export default class Title extends Component {
  static PrimaryText = PrimaryText;
  static SubText = SubText;
  render() {
    const { children, style = {} } = this.props;
    return (
      <Wrapper style={style}>
        {children}
      </Wrapper>
    );
  }
}

Title.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  style: PropTypes.shape({})
};
