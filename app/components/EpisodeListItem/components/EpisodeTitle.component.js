import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Grid, Typography} from '../../styles';
import variables from '../../styles/variables';
import { trim } from '../../../util';
const { Row, Col } = Grid;
const {Title, PrimaryText} = Typography;

const Wrapper = styled.View`

`;


const EpisodeTitle = ({ title, description, daysAgo, duration }) => (
  <Wrapper>
    <Row>
      <Col flex={1}>
        <Row>
          <Col flex={1}><Title>{title}</Title></Col>
        </Row>
      </Col>
    </Row>
    <Row style={{ marginTop: variables.M_1 }}>
      <Col justifyContent="flex-end"><PrimaryText big>{daysAgo}</PrimaryText></Col>
      <Col justifyContent="flex-end" style={{ marginLeft: variables.M_1 }}>
        <PrimaryText big>{duration}</PrimaryText>
      </Col>
    </Row>
    {description && <Row style={{ marginTop: variables.M_2 }}>
      <Col><PrimaryText>{trim(description, 180)}</PrimaryText></Col>
    </Row>}
  </Wrapper>
);

EpisodeTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  duration: PropTypes.string,
  daysAgo: PropTypes.string,
  length: PropTypes.number,
  vertical: PropTypes.string
};


export default EpisodeTitle;
