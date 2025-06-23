import { Platform } from 'react-native';

let Facebook = null;

// Only use Facebook SDK on native platforms
if (Platform.OS !== 'web') {
  try {
    Facebook = require('expo-facebook');
    const Constants = require('expo-constants');
    
    if (Constants.manifest?.extra?.facebook?.appId) {
      Facebook.initializeAsync({ 
        appId: Constants.manifest.extra.facebook.appId 
      });
    }
  } catch (error) {
    console.warn('Facebook SDK initialization failed:', error);
  }
}

export const authenticateWithFacebook = async () => {
  if (Platform.OS === 'web') {
    throw new Error('Facebook authentication not available on web');
  }
  
  if (!Facebook) {
    throw new Error('Facebook SDK not initialized');
  }
  
  try {
    const { token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email']
    });
    return token;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const loginWithFacebookToken = async (token) => {
  if (Platform.OS === 'web') {
    throw new Error('Facebook login not available on web');
  }
  
  const firebase = require('./firebase').default;
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return await firebase.auth().signInWithCredential(credential);
};

export default Facebook;