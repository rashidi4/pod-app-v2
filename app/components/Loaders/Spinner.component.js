import React from 'react';
import PropTypes from 'prop-types';
import {
  MaterialIndicator,
} from 'react-native-indicators';
import variables from '../styles/variables';


// const BigLoader = ({size = 48, color = variables.BORDER_COLOR_DARK, style = {}}) => {
//   const rotate = spinValue.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});
//   return (
//     <Animated.View style={{...style, height: size, width: size, style: 0, margin: 0, transform: [{rotate}]}}>
//       <AntDesign size={size} name="loading1" color={color}/>
//     </Animated.View>)
// };

const BigLoader = ({size = 48, color = variables.BORDER_COLOR_DARK }) => {
  return <MaterialIndicator size={size} color={color} />
};
BigLoader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.shape({})
};

export default BigLoader;
