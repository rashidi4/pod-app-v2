import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Grid} from '../../styles';
import variables from '../../styles/variables';

const {Row, Col} = Grid;

const Label = ({text, required = false}) => {
  return (
    <RowWrapper>
      <Col>
        <TextWrapper>
          <Title>{text}</Title>
          {required && <RequiredMark>*</RequiredMark>}
        </TextWrapper>
      </Col>
    </RowWrapper>
  );
};

export default Label;

Label.propTypes = {
  text: PropTypes.string,
  required: PropTypes.bool,
};

const Title = styled.Text`
color: ${variables.FONT_COLOR_SUBTLE};
font-size: ${variables.FONT_SIZE_H3}px;
`;
const RequiredMark = styled.Text`
color: ${variables.RED};
`;

const RowWrapper = styled(Row)`
margin-bottom: ${variables.M_2}px;
`;

const TextWrapper = styled.View`
flex-direction: row;
align-items: flex-start;
`;
