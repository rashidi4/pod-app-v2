import React from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {any, func} from 'prop-types';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';

const SortBar = ({ style = {}, refetch }) => {
  return (<Wrapper style={style}>
    <Text>Sorted By: Date</Text>
    <RefereshBtn onPress={refetch}>
      <TextAction>
        <MaterialCommunityIcons name="refresh" size={18} />
      </TextAction>
    </RefereshBtn>
  </Wrapper>)
};

export default SortBar;

SortBar.propTypes = {
  style: any,
  refetch: func,
};

const Wrapper = styled(Animated.View)`
position:absolute;
left:0;
right: 0;
background-color: ${variables.WHITE};
padding: ${variables.M_1}px ${variables.M_3}px ${variables.M_1}px ;
border-bottom-width: 1px
border-bottom-color: ${variables.BORDER_COLOR_DARK};
flex-direction: row;
justify-content: space-between;
align-items:center;
`;

const Text = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
margin: 0;
padding:0;

`;

const TextAction = styled.Text`
color: ${variables.ACTIVE_COLOR};
`;

const RefereshBtn = styled(TouchableOpacity)`
`;
