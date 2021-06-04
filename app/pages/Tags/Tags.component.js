import React, { Component } from 'react';
import { View } from 'react-native';
import Placeholder from '../../components/Placeholder/Placeholder.component';


export default class Tags extends Component {
  render() {
    return (
      <View>
        <Placeholder name="Tags">
          <Placeholder name="Tags Header"/>
          <Placeholder name="Search Box"/>
          <Placeholder name="Api Service">
            <Placeholder name="Tag List">
              <Placeholder name="Tag List Item"/>
              <Placeholder name="Tag List Item"/>
              <Placeholder name="Tag List Item"/>
              <Placeholder name="Tag List Item"/>
            </Placeholder>
          </Placeholder>
        </Placeholder>
      </View>
    );
  }
}
