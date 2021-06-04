import React from 'react';
import AppNavigator from './AppNavigator';

import { GlobalContext} from './util/GlobalContext';

const defaultValue = {
  onLoadCallbacks: [],
  onTabBarLoad: (fn) => {
    defaultValue.onLoadCallbacks.push(fn);
  },
  tabBarLoad: () => {
    defaultValue.onLoadCallbacks.forEach(fn => fn())
  }

};
const App = () => (
  <GlobalContext.Provider value={defaultValue}>
    <AppNavigator />
  </GlobalContext.Provider>
);

export default App

