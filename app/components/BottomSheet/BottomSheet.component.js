import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import BottomSheetExternal from 'reanimated-bottom-sheet';
import SheetHeader from './components/SheetHeader.component';
import variables from '../styles/variables';

const Wrapper = styled.View`
background-color: #FFFFFF;
border-left-width: 1px;
border-right-width: 1px;
border-color: ${variables.BORDER_COLOR};
height: 472px;
width: 100%;
`;

const IS_ANDROID = Platform.OS === 'android';

class BottomSheet extends Component {

  renderContent = () => {
    const {children} = this.props;
    return <Wrapper>{children}</Wrapper>;
  };
  renderHeader = () => {
    const { fall } = this.props;
    return <SheetHeader bg={'#FFFFFF'} fall={fall} />
  };

  render() {
    const { forwardedRef, fall, onOpenEnd, onCloseEnd } = this.props;
    return (

      <BottomSheetExternal
        enabledContentTapInteraction={!IS_ANDROID}
        enabledContentGestureInteraction={!IS_ANDROID}
        enabledInnerScrolling={!IS_ANDROID}
        ref={forwardedRef}
        snapPoints={[500, -50]}
        renderContent={this.renderContent}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={fall}
        onOpenEnd={onOpenEnd}
        onCloseEnd={onCloseEnd}
      />
    );
  }
}

BottomSheet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  forwardedRef: PropTypes.any,
  fall: PropTypes.shape({}),
  onOpenEnd: PropTypes.func,
  onCloseEnd: PropTypes.func,
};

export default BottomSheet;
