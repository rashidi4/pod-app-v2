import {InMemoryCache, ApolloClient, HttpLink} from '@apollo/client';
import {CachePersistor} from 'apollo-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setContext} from '@apollo/client/link/context';
import firebase from './firebase';
import resolvers from '../model/resolvers';
import {typeDefs} from '../model/schema/schema';

const SCHEMA_VERSION = '3'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';
let CLIENT = null;
// https://gist.github.com/lifeiscontent/b72b8777c9707093cdd9a08b79de2fa1
let persistor = null;
export async function createClient() {

  const cache = new InMemoryCache({
    dataIdFromObject: (object) => {
      if (object.id) {
        // eslint-disable-next-line no-underscore-dangle
        return `${object.__typename}-${object.id}`;
      }
      if (object.cursor) {
        // Cursor edge instead, fixes invalid duplicate
        // eslint-disable-next-line no-underscore-dangle
        return `${object.__typename}-${object.cursor}`;
      }
      // Use a fallback to default handling if neither id nor cursor
      if (object.date) {
        return `${object.__typename}-${object.date}`;
      }
      const random = Math.ceil(Math.random() * 10000000000);
      if (object.date) {
        return `${object.__typename}-${random}`;
      }
    },
  });

  persistor = new CachePersistor({
    cache,
    storage: AsyncStorage,
  });

  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    // If the current version matches the latest version,
    // we're good to go and can restore the cache.
    await persistor.restore();
  } else {
    // Otherwise, we'll want to purge the outdated persisted cache
    // and mark ourselves as having updated to the latest version.
    await persistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }




  // cache.writeData({
  //   data: {
  //     downloads: [],
  //     progress: [],
  //     // visibilityFilter: 'SHOW_ALL',
  //     // networkStatus: {
  //     //   __typename: 'NetworkStatus',
  //     //   isConnected: false,
  //     // },
  //   },
  // });

  const contextLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await firebase.auth().currentUser.getIdToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    }
  });
// client.onResetStore(() => cache.writeData({data}));

  const httpLink = new HttpLink({
    uri: 'http://localhost:4000'//'https://pod-audio-dev-jc.appspot.com',
    // headers: {
    //   authorization: localStorage.getItem('token'),
    //   'client-name': 'Space Explorer [web]',
    //   'client-version': ',1.0.0',
    // },
  });
  // const catchLink = onCatch(({ networkError = {} }) => {
  //   if (propEq('statusCode', 401, networkError)) {
  //     // remove cached token on 401 from the server
  //     RouterActions.unauthenticated({ isSigningOut: true });
  //   }
  // });

  const link = contextLink
    // .concat(catchLink)
    .concat(httpLink);

  CLIENT = new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers
  });
  return CLIENT;
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
