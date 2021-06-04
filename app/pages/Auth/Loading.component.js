import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import {Platform, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import {NavigationEvents} from 'react-navigation';
import firebase from '../../util/firebase';
import BigLoader from '../../components/Loaders/Spinner.component';
import variables from '../../components/styles/variables';

const Loading = ({ navigation }) => {
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'SignUp')
    });
    return subscriber;
  }, []);

  const updateStatusBar = useCallback(() => {
    Platform.OS === 'android' && StatusBar.setBackgroundColor(variables.WHITE);
  }, []);
  return (
    <Wrapper>
      <NavigationEvents onDidFocus={updateStatusBar} />
      <BigLoader />
    </Wrapper>
  )
};


Loading.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  })
};

export default Loading;

const Wrapper = styled.View`
flex: 1;
justify-content: center;
align-items: center;
`;
