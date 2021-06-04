import {Dimensions, Platform} from 'react-native';
import PageWrapper from './PageWrapper/PageWrapper.component';
import Gutter from './Gutter/Gutter.component';
import Grid from './Grid/Grid.component';
import Typography from './Typography/Typography.component';
import Spacer from './Spacer/Spacer.component';
import styled from 'styled-components/native';
import ImageLoad from 'react-native-image-placeholder';

//
const WebOnlyHeightHack = styled.View`
${Platform.OS === 'web' ? `height: ${Dimensions.get('window').height - 110}px` : 'flex: 1'}
`;

const Img = styled(ImageLoad)`
  width: ${({size}) => size }px;
  height: ${({size}) => size }px;
  ${({ marginTop }) => marginTop ? `margin-top: ${marginTop}` : ''}
  ${({ marginBottom }) => marginBottom ? `margin-top: ${marginBottom}` : ''}
  
`;

const Shadow = styled.View`
  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000;
  shadow-offset: -2px 2px;
  elevation:1;
`;

export {
  PageWrapper,
  Gutter,
  Grid,
  Typography,
  Spacer,

  WebOnlyHeightHack,
  Img,
  Shadow
};
