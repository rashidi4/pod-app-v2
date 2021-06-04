import { createStackNavigator } from 'react-navigation-stack';
import Home from './Home/Home.component';

const HomeNavigator = createStackNavigator({
  Home: {
    screen: Home
  },

}, {
  initialRouteName: 'Home',
});

export default HomeNavigator;