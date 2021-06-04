import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import withChildComponents from '../hoc/withChildComponents';
import MenuItem from './components/MenuItem.component';
import variables from '../styles/variables';

class Menu extends Component {
  render() {
    const { children } = this.props;
    return (
      <Wrapper>
        {children}
      </Wrapper>
    );
  }
}

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};

export default withChildComponents(Menu, [{
  ComponentClass: MenuItem,
  className: 'Item'
}])

const Wrapper = styled.View`
background-color: ${variables.LIGHT_BG};
border-radius: ${variables.BORDER_RADIUS};
`;
