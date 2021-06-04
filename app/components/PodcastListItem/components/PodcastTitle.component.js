import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import {Grid, Typography} from '../../styles';
import variables from '../../styles/variables';

const { Row, Col } = Grid;
const {Title, PrimaryText, TinyBold} = Typography;

const Wrapper = styled.View`

`;
const Time = styled.View`

`;

const PodcastTitle = ({ title, subtitle, description, length }) => (
    <Wrapper>
      <Row>
        <Col flex={1}>
          <Row>
            <Col flex={1}><Title>{title}</Title></Col>
          {length &&
            <Col>
                <Time>
                  <TinyBold>{length}</TinyBold>
              </Time>
            </Col>
          }
          </Row>
        </Col>
      </Row>
      {subtitle && <Row style={{ marginTop: variables.M_1 }}>
        <Col><PrimaryText>{subtitle}</PrimaryText></Col>
      </Row>}
      {description && <Row style={{ marginTop: variables.M_1 }}>
        <Col><PrimaryText>{description}</PrimaryText></Col>
      </Row>}
    </Wrapper>
);

PodcastTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  length: PropTypes.string,
  vertical: PropTypes.string
};


export default PodcastTitle;
