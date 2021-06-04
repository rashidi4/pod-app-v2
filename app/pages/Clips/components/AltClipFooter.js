import React from 'react';
import {func, bool} from 'prop-types';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import variables from '../../../components/styles/variables';
import BigLoader from '../../../components/Loaders/Spinner.component';

export const AltClipFooter = ({ onPress, loading, showBtn }) => {
  return (<Wrapper>
    {showBtn && <Button onPress={onPress} disabled={loading}>
      {!loading &&<Text>
        Load More
      </Text>}
      {loading && <BigLoader size={24} />}
    </Button>}
  </Wrapper>);
};

AltClipFooter.propTypes = {
  onPress: func,
  loading: bool,
  showBtn: bool
};

const Wrapper = styled.View`
`;

const Button = styled(TouchableOpacity)`
border-width: 1px;
border-radius: 5px;
border-color: ${variables.BORDER_COLOR_DARK}
margin: 5px;
align-items:center;
height: 40px;
opacity: ${({ disabled }) => disabled ? 0.3 : 1}
`;
const Text = styled.Text`
padding: 10px;
color: ${variables.FONT_COLOR_SUBTLE};

`;
