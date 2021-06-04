import React from 'react';
import Animated from 'react-native-reanimated';
import PropTypes from 'prop-types';

export const getFall = () => {
  return new Animated.Value(1);
};



// const Screen = styled(Animated.View)`
// width:100%;
// height:0;
// flex:1;
// background-color: #000;
// position: absolute;
// z-index: 0;
// opacity: 0.3;
// shadow-opacity: 0.3;
// shadow-radius: 2px;
// shadow-color: #000;
// shadow-offset: -2px 2px;
// `;

const HideableContent = ({ children, fall }) => {

  return (<Animated.View style={{
    flex: 1,
    opacity: Animated.add(0.1, Animated.multiply(fall, 0.9)),
  }}>
    {children}
  </Animated.View>);
};
/*
    <Screen
      style={{
        op: Animated.sub(100, Animated.multiply(fall, 100))
      }}
    />
 */

HideableContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  fall: PropTypes.shape({})
};


export default HideableContent;