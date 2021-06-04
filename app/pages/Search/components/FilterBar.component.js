import React, { useState, useCallback } from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {func} from 'prop-types';
import styled from 'styled-components/native'
import variables from '../../../components/styles/variables';
import { GENRES } from '../../../services/APIService/Podcast.service';


const FilterBar = ({ onChange }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const onPressFilter = useCallback((value) => {
    setActiveFilter(value);
    if (onChange) {
      onChange(value);
    }
  }, []);
  const MY_LIKES = 'My Likes';
  return (
    <Wrapper>
      <ScrollView horizontal>
        <FilterItem onPress={() => onPressFilter('')}>
          <FilterText active={!activeFilter}>
            Popular
          </FilterText>
        </FilterItem>
        <FilterItem onPress={() => onPressFilter(MY_LIKES)}>
          <FilterText active={activeFilter === MY_LIKES}>
            {MY_LIKES}
          </FilterText>
        </FilterItem>
        {GENRES.map((text, i) => (
          <FilterItem key={i} onPress={() => onPressFilter(text)}>
            <FilterText active={activeFilter === text}>
              {text}
            </FilterText>
          </FilterItem>
        ))}
      </ScrollView>
    </Wrapper>
  );
};

FilterBar.propTypes = {
  onChange: func
};

const Wrapper = styled.View`
flex-direction: row;
border-bottom-width:0;
margin-left: 10px;
`;
const FilterItem = styled(TouchableOpacity)`
padding: 0px 3px 10px;
margin-right: 5px;
`;

const FilterText = styled.Text`
color: ${({active}) => active ? variables.ACTIVE_COLOR : variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H4};
`;

export default FilterBar;
