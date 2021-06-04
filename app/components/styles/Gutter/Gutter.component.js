import styled from 'styled-components/native';

export default styled.View`
  padding: 0 15px;
  ${({ flex }) => flex ? `flex: ${flex}` : ''};
`;
