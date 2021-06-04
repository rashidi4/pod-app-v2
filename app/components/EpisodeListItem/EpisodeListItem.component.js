import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PixelRatio, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components/native';
import variables from '../styles/variables';
import { Grid } from '../styles';
import EpisodeTitle from './components/EpisodeTitle.component';
import { withChildComponents } from '../hoc';

const { Row, Col } = Grid;
const NOOP = () => {};

const Wrapper = styled(TouchableOpacity)`
  padding: 10px;
`;

const Separator = styled.View`
      border-bottom-width: 1px;
      border-bottom-color: ${({ color }) => color ? color : variables.SEPARATOR_COLOR};
      ${({ left }) => left ? `margin-left: ${left / PixelRatio.get()}px`: ''}
      height: 0.5px;
`;

class EpisodeListItem extends Component {

  render() {
    const { ellipsis = true, onPress, item } = this.props;
    return (
      <View>
        <Wrapper onPress={(e) => onPress(e, item)}>
          <Row>
            <Col flex={1}>
              {this.components.Title}
            </Col>
            {ellipsis && <Col maxWidth={10} alignItems="center" justifyContent="center">
              <FontAwesomeIcon icon={faEllipsisV} style={{color: variables.FONT_COLOR_LIGHT }}/>
            </Col>}
          </Row>
        </Wrapper>
        {this.components.Separator}
      </View>
    );
  }
}

EpisodeListItem.propTypes = {
  ellipsis: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  item: PropTypes.shape({
    artworkUrl100: PropTypes.string,
    collectionName: PropTypes.string
  }),
  onPress: PropTypes.func
};

EpisodeListItem.defaultProps = {
  onPress: NOOP
};


export default withChildComponents(EpisodeListItem, [{
  ComponentClass: EpisodeTitle,
  className: 'Title',
  defaultImplementation: ({ feed = {} } = {}) => {
    return {
      uri: feed.uri
    }
  }
}, {
  ComponentClass: Separator,
  className: 'Separator'
}]);