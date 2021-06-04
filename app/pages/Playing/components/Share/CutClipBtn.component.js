import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colorVariables from '../../../../components/styles/variables';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import variables from '../../../../components/styles/variables';

const NOOP = () => {};

const CutClipBtn = (props) => {
  const {
    active,
    onPress,
  } = props;

  return (
    <CutWrapperBtn
      active={active}
      onPress={onPress}
      disabled={!active}
    >
      <MaterialCommunityIcons
        name="scissors-cutting"
        size={24}
        color={colorVariables.LIGHT_BLUE}
      />
    </CutWrapperBtn>
  )
};

CutClipBtn.propTypes = {
  active: PropTypes.bool,
  onPress: PropTypes.func,
};

CutClipBtn.defaultProps = {
  onPress: NOOP,
};

export default CutClipBtn;

const CutWrapperBtn = styled(TouchableOpacity)`
  background-color: ${variables.ACTIVE_COLOR};
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items:center;
  border-radius: 25px;
  margin-right: 20px;
  opacity: ${({ active }) => active ? 1 : 0.3 };
  `;
