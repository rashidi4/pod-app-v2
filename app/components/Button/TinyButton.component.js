import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import variables from '../styles/variables';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

const TouchBtnWrapper = styled.View`
opacity: ${({ active, disabled }) => active && !disabled ? 1.0 : 0.5 };
`;

const TouchBtn = styled(TouchableOpacity)`
background-color: ${variables.ACTIVE_COLOR};
${({ width}) => width ? `width: ${width}px;`: ''}
justify-content: center;
align-items: center;
margin: 1px 1px 1px 0;
border: 1px solid ${variables.BORDER_COLOR};
border-radius: 5px;
padding: 5px 0;
`;

const NOOP = () => {};

const TinyButton = ({ children, active = true, width, onPress = NOOP }) => {
  return <TouchBtnWrapper active={active} disabled={!active}>
    <TouchBtn width={width} onPress={onPress}>
      {children}
    </TouchBtn>
  </TouchBtnWrapper>
};
TinyButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  active: PropTypes.bool,
  onPress: PropTypes.func,
  width: PropTypes.number
};

export default TinyButton;
