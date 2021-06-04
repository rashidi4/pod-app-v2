import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';


export default class RecommendationsList extends Component {

  render() {
    const { children, data, horizontal = true,  keyExtractor} = this.props;
    return (
      <FlatList
        horizontal={horizontal}
        data={data}
        renderItem={children}
        keyExtractor={keyExtractor}
      />
    );
  }
}

RecommendationsList.propTypes = {
  children: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  horizontal: PropTypes.bool,
  keyExtractor: PropTypes.func,
};

RecommendationsList.defaultProps = {
  keyExtractor: item => '' + item.id
};



