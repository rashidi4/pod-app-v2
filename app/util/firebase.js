import firebase from 'firebase';
import Constants from 'expo-constants';
console.log(Constants.manifest.extra.firebase);
firebase.initializeApp(Constants.manifest.extra.firebase);


export default firebase;
