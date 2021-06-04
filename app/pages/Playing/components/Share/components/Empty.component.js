import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import variables from '../../../../../components/styles/variables';

const Empty = ({ onPress }) => (
  <Wrapper>
    <ActionBtn onPress={onPress}>
      <MaterialCommunityIcons name="text-to-speech" size={32} color={variables.ACTIVE_COLOR} />
      <Text>Process Speech To Text</Text>
    </ActionBtn>
  </Wrapper>
);
Empty.propTypes = {
  onPress: PropTypes.func
};

export default Empty;

const Wrapper = styled.View`
justify-content: flex-end;
align-items: center;
margin-left: -50px;
`;

const ActionBtn = styled.TouchableOpacity`
justify-content: center;
align-items:center;
`;

const Text = styled.Text`
color: ${variables.ACTIVE_COLOR};
align-items:center;
text-align:center;
`;
