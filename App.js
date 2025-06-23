import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createClient } from './app/util/client';
import AppMain from './app/index';
import variables from './app/components/styles/variables';

export default class App extends Component {
  state = {
    client: null,
    loaded: false
  };

  async componentDidMount() {
    const client = await createClient();
    this.setState({
      client,
      loaded: true,
    });
  }
  
  render() {
    const { client, loaded } = this.state;

    if (!loaded) {
      return <LoadingText>Loading</LoadingText>
    }
    
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StatusBar
            backgroundColor={variables.BACKGROUND_BG}
            barStyle="dark-content"
            translucent={true}
          />
          <AppMain />
        </NavigationContainer>
      </ApolloProvider>
    );
  }
}

const LoadingText = styled.Text`
`;