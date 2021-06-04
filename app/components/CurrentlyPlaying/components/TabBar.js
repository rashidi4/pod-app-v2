import React from 'react';
import {shape, func, bool} from 'prop-types';
import {SafeAreaView} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native'
import Tab from './Tab';
import variables from '../../styles/variables';

const TabBar = (props) => {
  const { navigation, borderTop } = props;
  const position = new Animated.Value(navigation.state.index);
  return (
    <Wrapper borderTop={borderTop}>
      {navigation.state.routes.map((route, index) => {
        const focusAnim = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0, 1, 0]
        });

        return (
          <Tab
            key={index}
            focusAnim={focusAnim}
            route={route}
            active={index === navigation.state.index}
            onPress={() => navigation.navigate(route.routeName)}
          />
        )
      })}
    </Wrapper>
  )
};

export default TabBar;

TabBar.propTypes = {
  navigation: shape({
    navigate: func,
  }),
  navigationState: shape({}),
  position: shape({
    interpolate: func
  }),
  borderTop: bool,
};

const Wrapper = styled(SafeAreaView)`
padding-top: ${variables.M_1}px;
flex-direction: row;
justify-content: space-around;
align-items: flex-start;
${ ({ borderTop }) => borderTop ? `
border-top-width: 1px;
border-top-color: ${variables.SEPARATOR_COLOR};
` : ''};
`;
