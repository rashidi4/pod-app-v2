import React, { Component } from 'react';
import PropTypes from 'prop-types';
import variables from '../variables';
import styled from 'styled-components/native';



export default class PageWrapper extends Component {
  render() {
    const { children, bg = variables.BACKGROUND_BG } = this.props;

    return (
      <Wrapper bg={bg}>
        {children}
      </Wrapper>
    );
  }
}
// need additional config around safe area on android
const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: ${({ bg }) => bg};
`;


PageWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  scroll: PropTypes.bool,
  bg: PropTypes.string
};
