import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parseString } from 'react-native-xml2js';
import Feed from '../../model/Feed';
import { View } from 'react-native';

export default class FeedService extends Component {
  state = {};
  async componentDidMount() {
    const { url } = this.props;
    if (url) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        parseString(text, {trim: true},  (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            const feed = new Feed(result.rss);
            this.setState({ feed });
          }
        });
      } catch(e) {
        console.log(e);
      }

    }

  }
  render() {
    const { children } = this.props;
    const { feed } = this.state;


    if (typeof children === 'function') {
      if (!feed) return null;
      return children(feed);
    }
    return (
      <View>
        {children}
      </View>
    );
  }
}

FeedService.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ]),
  url: PropTypes.string,
  responseType: PropTypes.string
};