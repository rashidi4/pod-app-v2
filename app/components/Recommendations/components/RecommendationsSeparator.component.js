import React from 'react';
import styled from 'styled-components/native';
import variables from '../../styles/variables';


const Separator = () => {
  return (
    <SeparatorWrapper />
  )
};


const SeparatorWrapper = styled.View`
  border-bottom-width:1px;
  border-color: ${variables.LIGHT_BLUE};
  width: 100%;
  height: 1px;
  padding: ${variables.P_2}px;
`;

export default Separator;
