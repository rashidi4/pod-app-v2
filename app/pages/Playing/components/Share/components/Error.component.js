import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import variables from '../../../../../components/styles/variables';

const Error = ({ onPress, text, description }) => (
  <Wrapper>
    <ActionBtn onPress={onPress}>
      <MaterialIcons name="error-outline" size={32} color={variables.ACTIVE_COLOR} />
      {!!text && <Text>{text}</Text>}
      {!!description && <Text>{description}</Text>}
    </ActionBtn>
  </Wrapper>
);
Error.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  description: PropTypes.string,
};

export default Error;

const Wrapper = styled.View`
flex: 1;
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
