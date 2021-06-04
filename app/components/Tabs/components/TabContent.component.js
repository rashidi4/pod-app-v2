import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`

`;

export default class TabContent extends Component {

  render() {
    return (
      <Wrapper>
        <Text>One</Text>
      </Wrapper>
    );
  }
}

TabContent.propTypes = {
  id: PropTypes.string
};
