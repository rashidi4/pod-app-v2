import React from 'react';
// import PropTypes from 'prop-types';
import {BottomSheet} from '../../../components';
import styled from 'styled-components/native';

const Wrapper = styled.View`
`;
const Text = styled.Text`
`;

const Tag = React.forwardRef((props, ref) => {//eslint-disable-line
 function Tag() {
   return (
     <BottomSheet {...props} ref={ref}>
       <Wrapper>
        <Text>blah</Text>
       </Wrapper>
     </BottomSheet>
   )
 }

  return <Tag />;
});


export default Tag;
