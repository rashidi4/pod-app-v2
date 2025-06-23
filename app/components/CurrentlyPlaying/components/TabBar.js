import React from 'react';
import {shape, func, bool} from 'prop-types';
import {SafeAreaView} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native'
import Tab from './Tab';
import variables from '../../styles/variables';

const TabBar = (props) => {
  const { state, descriptors, navigation, borderTop } = props;
  
  return (
    <Wrapper borderTop={borderTop}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Tab
            key={route.key}
            route={route}
            active={isFocused}
            onPress={onPress}
          />
        )
      })}
    </Wrapper>
  )
};

export default TabBar;

TabBar.propTypes = {
  state: shape({}),
  descriptors: shape({}),
  navigation: shape({
    navigate: func,
    emit: func,
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