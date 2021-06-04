import React from 'react';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';

const Separator = () => (
  <Sep />
);

export default Separator;

const Sep = styled.View`
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-color: ${variables.BORDER_COLOR};
  background-color: ${variables.BACKGROUND_BG};
  height:8px;
`;
