import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Platform } from 'react-native';
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
    try {
      const client = await createClient();
      this.setState({
        client,
        loaded: true,
      });
    } catch (error) {
      console.error('Failed to create Apollo client:', error);
      // For web compatibility, we'll still show the app even if client creation fails
      this.setState({
        client: null,
        loaded: true,
      });
    }
  }
  
  render() {
    const { client, loaded } = this.state;

    if (!loaded) {
      return <LoadingText>Loading...</LoadingText>
    }
    
    // If we're on web and don't have a client, we can still show the UI
    const AppContent = () => (
      <NavigationContainer>
        <StatusBar
          backgroundColor={variables.BACKGROUND_BG}
          barStyle="dark-content"
          translucent={Platform.OS !== 'web'}
        />
        <AppMain />
      </NavigationContainer>
    );

    if (client) {
      return (
        <ApolloProvider client={client}>
          <AppContent />
        </ApolloProvider>
      );
    }
    
    // Fallback for web when Apollo client fails
    return <AppContent />;
  }
}

const LoadingText = styled.Text`
  flex: 1;
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: ${variables.FONT_COLOR_DARK};
`;