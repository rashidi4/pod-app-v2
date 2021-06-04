import React from 'react';
import {func, arrayOf, shape} from 'prop-types';
import styled from 'styled-components/native';
import {ScrollView, TouchableOpacity} from 'react-native';
import variables from '../../../../components/styles/variables';

export const SelectionControls = ({ markers = [], onPressMarker }) => {

  return (
    <Controls>
      <SelectionController horizontal>
        {markers.map((marker, i) => {
          return (
            <SelectionMarker active={marker.isActive} key={i} onPress={() => onPressMarker({ marker, index: i })}>
              <Text>{marker.secondsText}</Text>
            </SelectionMarker>
          );
        })}
      </SelectionController>
    </Controls>
  )
};
SelectionControls.propTypes = {
  onPressMarker: func,
  markers: arrayOf(shape({}))
};

const NOOP = () => {};

SelectionControls.defaultProps = {
  onPressMarker: NOOP,
};

const Controls = styled.View`

`;

const SelectionController = styled(ScrollView)`
height: 80px;
background-color: ${variables.LIGHT_BLUE};
border-bottom-width: 1px;
border-top-color:${variables.BORDER_COLOR};
border-bottom-color: ${variables.BORDER_COLOR_DARK};
flex-direction: row;
padding-left: ${variables.P_1}px;
`;

const SelectionMarker = styled(TouchableOpacity)`
width: 100px;
background-color: ${variables.WHITE};
border-width:1px;
border-color: ${({ active }) => active ? variables.ACTIVE_COLOR : variables.BORDER_COLOR_DARK};
margin: ${variables.M_1}px ${variables.M_1}px ${variables.M_1}px 0px;
justify-content: center;
align-items:center;
`;
const Text = styled.Text`
font-size: ${variables.FONT_SIZE_H4};
color: ${variables.FONT_COLOR_SUBTLE};
font-weight: bold;
`;
