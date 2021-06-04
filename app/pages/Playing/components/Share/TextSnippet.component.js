import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import variables from '../../../../components/styles/variables';



const TextSnippet = ({ minute, children }) => {

  return (
    <Wrapper>
      <TextColData>
        <TextColDetails>
          <Minutes>{minute}</Minutes>
        </TextColDetails>
      </TextColData>
      <TextCol>
        {children}
      </TextCol>
    </Wrapper>
  );
};

TextSnippet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  minute: PropTypes.string,
};

export default TextSnippet;

const Wrapper = styled.View`
flex-direction:row;
`;


const TextCol = styled.View`
flex: 1;
padding-left: ${variables.P_1}px;
padding-bottom: ${variables.P_3}px;

`;

const TextColData = styled.View`
flex-direction: row;
width:50px;

`;

const TextColDetails = styled.View`
border-right-width: 2px;
border-color: ${variables.BACKGROUND_BG};
width:50px;
 
`;

const Minutes = styled.Text`
font-size: 8px;
color: ${variables.FONT_COLOR_DARK};
text-align:center;
background-color: ${variables.LIGHT_BLUE}
padding-right: ${variables.P_1}px;
padding:2px 0 1px;
`;
