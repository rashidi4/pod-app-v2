import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PixelRatio, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import AlbumCover from './components/AlbumCover.component';
import variables from '../styles/variables';
import { Grid } from '../styles';
import PodcastTitle from './components/PodcastTitle.component';
import { withChildComponents } from '../hoc';

const { Row, Col } = Grid;
const NOOP = () => {};
const Wrapper = styled(TouchableOpacity)`
  padding: 10px 0;
`;

const Separator = styled.View`
      border-bottom-width: 1px;
      border-bottom-color: ${({ color }) => color ? color : variables.SEPARATOR_COLOR};
      ${({ left }) => left ? `margin-left: ${left / PixelRatio.get()}px`: ''}
      height: 0.5px;
`;

class PodcastListItem extends Component {

  render() {
    const { onPress, style = {}, justifyContent = 'flex-start' } = this.props;
    return (
      <>
        <Wrapper style={style} onPress={onPress} delayPressIn={100}>
          <Row>
            {this.components.AlbumCover && <Col style={{ marginRight: 10, marginLeft: 5 }}>
              {this.components.AlbumCover}
            </Col>}
            <Col flex={1} justifyContent={justifyContent}>
              {this.components.Title}
            </Col>
            {/*{ellipsis && <Col maxWidth={10} alignItems="center" justifyContent="center">*/}
            {/*  <FontAwesomeIcon icon={faEllipsisV} style={{color: variables.FONT_COLOR_LIGHT }}/>*/}
            {/*</Col>}*/}
          </Row>
        </Wrapper>
        {this.components.Separator}
      </>
    );
  }
}

PodcastListItem.propTypes = {
  ellipsis: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  podcast: PropTypes.shape({
    artworkUrl100: PropTypes.string,
    collectionName: PropTypes.string
  }),
  onPress: PropTypes.func,
  style: PropTypes.shape({}),
  justifyContent: PropTypes.string
};

PodcastListItem.defaultProps = {
  onPress: NOOP
};


export default withChildComponents(PodcastListItem, [{
  ComponentClass: AlbumCover,
  className: 'AlbumCover'
}, {
  ComponentClass: PodcastTitle,
  className: 'Title',
  defaultImplementation: ({ podcast = {} } = {}) => {
    return {
      uri: podcast.title
    }
  }
}, {
  ComponentClass: Separator,
  className: 'Separator'
}]);
