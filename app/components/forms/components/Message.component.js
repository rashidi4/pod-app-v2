import React from 'react';
import {string} from 'prop-types';
import styled from 'styled-components/native';
import variables from '../../styles/variables';

const Message = ({ text }) => {

  if (!text) return null;

  return (<Wrapper>
    <Text>{text}</Text>
  </Wrapper>);
};

export default Message;

Message.propTypes = {
  text: string,
};

const Wrapper = styled.View`
justify-content:center;
align-items:center;
background-color: ${variables.ERROR_BG};
border-radius: 5px;
border-color: ${variables.ERROR_BORDER};
padding:${variables.P_3}px 0;
margin-bottom: ${variables.M_3}px;
`;

const Text = styled.Text`
color: ${variables.BORDER_COLOR_DARK};
font-weight:bold;
`;
