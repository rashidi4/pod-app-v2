import React from 'react';
import {func, bool} from 'prop-types';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import variables from '../../../components/styles/variables';

const NextPage = ({ onPress, loading }) => {
  return (<Wrapper>
    <NextBtn onPress={onPress} disabled={loading}>
      <Text>Load More</Text>
    </NextBtn>
  </Wrapper>)
};

export default NextPage;

NextPage.propTypes = {
  onPress: func,
  loading: bool
};

const Wrapper = styled.View`
margin: 0 10px;
`;

const NextBtn = styled(TouchableOpacity)`
border:1px;
align-items:center;
padding: ${variables.P_2}px;
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK};
background-color: ${variables.BACKGROUND_BG};
opacity: ${({loading}) => loading ? 0.3 : 1}
`;

const Text = styled.Text`
color: ${variables.ACTIVE_COLOR};
`;
