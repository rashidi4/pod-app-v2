import React from 'react';
import styled from 'styled-components/native';

const View =  styled.View`
  ${({ height }) => height ? `height: ${height}px;` : ''}
  width: 100%;
  ${({ flex }) => flex ? `flex: ${flex}` : ''}
`;

const Spacer = (props) => (
  <View {...props} />
);

export default Spacer;