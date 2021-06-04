import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import withChildComponents from '../hoc/withChildComponents';
import {Row, Col} from '../styles/Grid/Grid.component'

import RecommendationsSubTitle from './components/RecommendationsSubTitle.component';
import RecommendationsTitle from './components/RecommendationsTitle.component';
import RecommendationsItem from './components/RecommendationsItem.component';
import RecommendationsList from './components/RecommendationsList.component';
import RecommendationsSeparator from './components/RecommendationsSeparator.component';
import variables from '../styles/variables';

const Wrapper = styled.View`
margin-bottom: ${variables.M_3}px;
`;


class Recommendations extends Component {
  render() {
    return (
      <Wrapper>
        <Row>
          <Col flex={1} style={{ marginBottom: variables.M_3 }}>
            {this.components.Title}
          </Col>
          <Col>
            {this.components.SubTitle}
          </Col>
        </Row>
        {this.components.List}
        {this.components.Separator}
      </Wrapper>
    );
  }
}

Recommendations.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  data: PropTypes.arrayOf(
    PropTypes.shape({}))
};

export default withChildComponents(Recommendations, [{
  ComponentClass: RecommendationsSubTitle,
  className: 'SubTitle'
}, {
  ComponentClass: RecommendationsTitle,
  className: 'Title'
}, {
  ComponentClass: RecommendationsItem,
  className: 'Item'
}, {
  ComponentClass: RecommendationsList,
  className: 'List',
},{
  ComponentClass: RecommendationsSeparator,
  className: 'Separator'
}]);
