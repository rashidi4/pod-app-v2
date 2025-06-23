import { InMemoryCache, ApolloClient, HttpLink } from '@apollo/client';
import { CachePersistor } from 'apollo-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { Platform } from 'react-native';
import firebase from './firebase';
import resolvers from '../model/resolvers';
import { typeDefs } from '../model/schema/schema';

const SCHEMA_VERSION = '3'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';
let CLIENT = null;
let persistor = null;

export async function createClient() {
  try {
    const cache = new InMemoryCache({
      dataIdFromObject: (object) => {
        if (object.id) {
          return `${object.__typename}-${object.id}`;
        }
        if (object.cursor) {
          return `${object.__typename}-${object.cursor}`;
        }
        if (object.date) {
          return `${object.__typename}-${object.date}`;
        }
        const random = Math.ceil(Math.random() * 10000000000);
        return `${object.__typename}-${random}`;
      },
    });

    // Only use cache persistence on native platforms
    if (Platform.OS !== 'web') {
      persistor = new CachePersistor({
        cache,
        storage: AsyncStorage,
      });

      const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

      if (currentVersion === SCHEMA_VERSION) {
        await persistor.restore();
      } else {
        await persistor.purge();
        await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      }
    }

    const contextLink = setContext(async (_, { headers }) => {
      try {
        // Only try to get Firebase token on native platforms or if Firebase is properly initialized
        if (Platform.OS !== 'web' && firebase.auth().currentUser) {
          const token = await firebase.auth().currentUser.getIdToken();
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            }
          }
        }
      } catch (error) {
        console.warn('Failed to get Firebase token:', error);
      }
      
      return {
        headers: {
          ...headers,
        }
      }
    });

    const httpLink = new HttpLink({
      uri: Platform.OS === 'web' 
        ? 'http://localhost:4000' // For web development
        : 'https://pod-audio-dev-jc.appspot.com', // For native
    });

    const link = contextLink.concat(httpLink);

    CLIENT = new ApolloClient({
      link,
      cache,
      typeDefs,
      resolvers,
      // Add default options for better web compatibility
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'ignore',
        },
        query: {
          errorPolicy: 'ignore',
        },
      },
    });

    return CLIENT;
  } catch (error) {
    console.error('Error creating Apollo client:', error);
    throw error;
  }
}

const getPersistor = () => {
  return persistor;
};

const getClient = () => {
  return CLIENT;
};

export {
  getPersistor,
  getClient,
}