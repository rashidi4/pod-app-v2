import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native'
import {TouchableOpacity} from 'react-native';
import variables from '../styles/variables';
import BigLoader from '../Loaders/Spinner.component';

const Submit = ({ text, onSubmit, loading }) => {
  return <Wrapper>
    <SubmitBtn onPress={onSubmit} disabled={loading}>
      {!loading && <BtnText>{text}</BtnText>}
      {loading && <BigLoader size={32} />}
    </SubmitBtn>
  </Wrapper>;
};

export default Submit;

Submit.propTypes = {
  text: PropTypes.string,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

Submit.defaultProps = {
  onSubmit: () => {}
};

const Wrapper = styled.View`
padding-bottom: ${variables.M_3}px;
`;

const SubmitBtn = styled(TouchableOpacity)`
background-color: ${variables.ACTIVE_COLOR};
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK};
border-width: 1px;
padding: 20px;
height:70px;
justify-content: center;
align-items:center;
opacity: ${({ loading }) => loading ? 0.3 : 1};
`;

const BtnText = styled.Text`
color: ${variables.LIGHT_BLUE};  
font-weight:bold;
`;
