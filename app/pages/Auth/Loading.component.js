import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components/native';
import { Platform, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import firebase from '../../util/firebase';
import BigLoader from '../../components/Loaders/Spinner.component';
import variables from '../../components/styles/variables';

const Loading = ({ navigation }) => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, skip auth and go directly to the app
      setTimeout(() => {
        navigation.navigate('App');
      }, 1000);
      return;
    }

    // Native platform auth flow
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'SignUp');
    });
    return subscriber;
  }, [navigation]);

  const updateStatusBar = useCallback(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(variables.WHITE);
    }
  }, []);

  return (
    <Wrapper>
      <BigLoader />
    </Wrapper>
  );
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
  background-color: ${variables.WHITE};
`;