import styled from 'styled-components/native';

export const Row = styled.View`
  display: flex;
  flex-direction:  row;
  ${({alignItems}) => alignItems ? `align-items:${alignItems}` : ''};
  ${({justifyContent}) => justifyContent ? `justify-content:${justifyContent}` : ''};
`;

export const Col = styled.View`
  ${({flex}) => flex ? `flex:${flex}` : ''};
  ${({maxWidth}) => maxWidth ? `max-width:${maxWidth}` : ''};
  ${({minWidth}) => minWidth ? `min-width:${minWidth}` : ''};
  ${({alignItems}) => alignItems ? `align-items:${alignItems}` : ''};
  ${({justifyContent}) => justifyContent ? `justify-content:${justifyContent}` : ''};
`;

export default {
  Row,
  Col
};
