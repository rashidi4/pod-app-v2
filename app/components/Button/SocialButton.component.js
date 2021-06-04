import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import variables from '../styles/variables';


const SocialButton = styled(TouchableOpacity)`
background-color: ${variables.WHITE};
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK};
border-width: 1px;
padding: ${variables.P_2}px;
flex-direction: row;
align-items:center;
`;

const SocialButtonText = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H5}px;
padding-left: ${variables.P_1}px;
`;

export {
  SocialButton,
  SocialButtonText
}
