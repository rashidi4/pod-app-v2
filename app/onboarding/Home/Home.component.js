import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Placeholder from '../../components/Placeholder/Placeholder.component';

class Home extends Component {
  static navigationOptions = () => ({
    headerShown: false
  });
  render() {
    return (
      <View>
        <Placeholder name="Onboarding">
          <Text>Onboard bitch</Text>
        </Placeholder>
      </View>
    );
  }
}


export default Home;