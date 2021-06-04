import * as React from 'react';
import {shape, func, string, bool} from 'prop-types';
import styled from 'styled-components/native';
import { TouchableOpacity, Platform } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import variables from '../../styles/variables';


const getIcon = ({ route }) => {
  switch(route.routeName) {
    case 'Home':
      return 'home-outline';
    case 'Search':
      return 'compass-outline';
    case 'Clips':
      return 'scissors-cutting';
    case 'Downloads':
      return 'bookmark-outline';
    case 'Profile':
      return 'account-outline';
    default:
      return 'home-outline';
  }
};

const Tab = ({ onPress, route, active }) => {


  return (
    <Button onPress={onPress}>
      <MaterialCommunityIcons
        name={getIcon({ route })}
        size={32}
        color={active ? variables.ACTIVE_COLOR : variables.FONT_COLOR_SUBTLE}
      />
    </Button>
  )
};

Tab.propTypes = {
  focusAnim: shape({
    interpolate: func
  }),
  route: shape({
    routeName: string
  }),
  active: bool,
  onPress: func
};

export default Tab;
const Button = styled(TouchableOpacity)`
padding: ${Platform.OS === 'ios' ? 10 : 5}px 0 10px 0;
`;
