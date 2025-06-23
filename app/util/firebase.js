import { Platform } from 'react-native';

let firebase = null;

// Only initialize Firebase on native platforms
if (Platform.OS !== 'web') {
  try {
    const firebaseModule = require('firebase');
    const Constants = require('expo-constants');
    
    if (Constants.manifest?.extra?.firebase) {
      firebaseModule.initializeApp(Constants.manifest.extra.firebase);
      firebase = firebaseModule;
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

// Provide a mock Firebase object for web compatibility
const mockFirebase = {
  auth: () => ({
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Simulate no user on web
      callback(null);
      return () => {}; // Return unsubscribe function
    },
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available on web')),
    signOut: () => Promise.resolve(),
    setPersistence: () => Promise.resolve(),
    signInWithCredential: () => Promise.reject(new Error('Firebase not available on web')),
  }),
};

export default firebase || mockFirebase;