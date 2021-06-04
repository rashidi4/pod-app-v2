import styled from 'styled-components/native';
import variables from '../variables';

const Title = styled.Text`
font-size: ${variables.FONT_SIZE_H4};
font-weight: bold;
`;

const PrimaryText = styled.Text`
font-size: ${({ big }) => big ? variables.FONT_SIZE_H4 : variables.FONT_SIZE_H5};
color: ${variables.FONT_COLOR_SUBTLE}
`;

const TinyBold = styled.Text`
font-size: ${variables.FONT_SIZE_TINY}
font-weight: bold;
color: ${variables.FONT_COLOR_SUBTLE}
`;

export default {
  Title,
  PrimaryText,
  TinyBold
};