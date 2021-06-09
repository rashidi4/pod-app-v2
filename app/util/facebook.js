import * as Facebook from 'expo-facebook';
import Constants from 'expo-constants';
import firebase from './firebase';

(async () => {
  const { appId } = Constants.manifest.extra.facebook;
  try {
    await Facebook.initializeAsync({ appId });
  } catch(e) {
    console.log(e);
  }
})();

export const authenticateWithFacebook = async () => {
  try {
    const {
      // type,
      token,
      // expires,
      // permissions,
      // declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email']
    });
    return token;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const loginWithFacebookToken = async (token) => {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const credential = firebase.auth.FacebookAuthProvider.credential(token);
  return await firebase.auth().signInWithCredential(credential);
};

export default Facebook;
