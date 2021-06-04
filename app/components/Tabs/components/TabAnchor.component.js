import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`

`;

export default class TabAnchor extends Component {

  render() {
    return (
      <Wrapper>
        <Text>One</Text>
      </Wrapper>
    );
  }
}

TabAnchor.propTypes = {
  id: PropTypes.string
};
