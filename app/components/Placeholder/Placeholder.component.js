import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  border: 1px solid #ccc;
`;

const Title = styled.Text`
  padding: 0 2px;
  margin: 0
`;

const FlexView = styled.View`
  display: flex;
  flex-direction:  ${props => props.horizontal ? 'row' : 'column'};
  justify-content: center;
`;

export default class Placeholder extends Component {
  render() {
    const { children, name, horizontal = false, style = {} } = this.props;
    return (
      <Wrapper style={style}>
        <View>
          <Title>{name}</Title>
        </View>
        <FlexView horizontal={horizontal}>
          { children }
        </FlexView>
      </Wrapper>
    );
  }
}

Placeholder.propTypes = {
  name: PropTypes.string,
  horizontal: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  style: PropTypes.shape({})
};