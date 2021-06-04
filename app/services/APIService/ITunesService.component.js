import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Episode from '../../model/Episode';
import mock from '../../../__mocks__/latest';
import apiResponse from '../../../__mocks__/apiService';

export default class ITunesService extends Component {
  render() {
    const { children, kind } = this.props;

    const data = kind === 'artist'
      ? apiResponse
      : {
        ...mock,
        item: (mock.item || []).map(item => new Episode(item))
      };
    if (typeof children === 'function') {
      return children(data);
    }
    return (
      <View>
        {children}
      </View>
    );
  }
}

ITunesService.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ]),
  kind: PropTypes.string
};