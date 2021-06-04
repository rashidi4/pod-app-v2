import Home from './Home/Home.component';
import Profile from './Profile/Profile.component';
import Search from './Search/Search.component';
import Downloads from './Downloads/Downloads.component';
import Podcast from './Podcast/Podcast.component';
import Playing from './Playing/Playing.component';
import Clips from './Clips/Clips.component';
import Tags from './Tags/Tags.component';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import variables from '../components/styles/variables';
import CurrentlyPlaying from '../components/CurrentlyPlaying/CurrentlyPlaying.component';

export {
  Home,
  Profile,
  Search,
  Downloads,
  Podcast,
  Playing,
  Tags
};


// const TabBarComponent = props => <BottomTabBar {...props} />;
const AppNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
  },
  Search: {
    screen: Search,
  },
  Clips: {
    screen: Clips,
  },
  Downloads: {
    screen: Downloads,
  },
  Profile: {
    screen: Profile,
  }
}, {
  initialRouteName: 'Home',
  tabBarOptions: {
    showIcon: true,
    showLabel: false,
    activeTintColor: variables.ACTIVE_COLOR,
  },
  tabBarComponent: CurrentlyPlaying,
});
export default AppNavigator;
