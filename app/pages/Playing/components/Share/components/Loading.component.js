import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import BigLoader from '../../../../../components/Loaders/Spinner.component';
import variables from '../../../../../components/styles/variables';

const Loader = ({ text }) => (
  <Wrapper>
    <BigLoader />
    {text && <Text>{text}</Text>}
  </Wrapper>
);
Loader.propTypes = {
  text: PropTypes.string
};

export default Loader;

const Wrapper = styled.View`
flex: 1;
justify-content: flex-end;
align-items: center;
height: 100%;
margin-left: -50px;
`;

const Text = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
align-items:center;
text-align:center;
`;
