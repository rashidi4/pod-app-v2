import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import variables from '../../styles/variables';

const HeaderWrapper = styled(Animated.View)`
  background-color: ${({ bg }) => bg};
  
  padding-top: 15;
  border-top-left-radius: 20;
  border-top-right-radius: 20;
  border-width: 1px;
  border-color: ${variables.BORDER_COLOR};
  border-bottom-width: 0;
  ${Platform.OS === 'ios' ? `
    box-shadow: 0px -4px 3px rgba(50,50,50,0.3)
  ` : ''}
  
`;


const HeaderPanel = styled.View`
align-items:center;
`;

const HeaderHandel = styled.View`
  width: 50px;
  height: 8px;
  borderRadius: 4px;
  backgroundColor: #00000040;
  margin-bottom: 10;
`;

// style={}
class SheetHeader extends Component {
  render() {
    const { bg = '#f7f5eee8', fall } = this.props;
    const style = Platform.OS === 'ios'
      ? { shadowOpacity: Animated.sub(1, fall)}
      : {};

    return (

      <HeaderWrapper bg={bg} style={style} >
        <HeaderPanel>
          <HeaderHandel />
        </HeaderPanel>
      </HeaderWrapper>
    );
  }
}

SheetHeader.propTypes = {
  bg: PropTypes.string,
  fall: PropTypes.any
};

export default SheetHeader;
