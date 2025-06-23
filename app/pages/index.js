import Home from './Home/Home.component';
import Profile from './Profile/Profile.component';
import Search from './Search/Search.component';
import Downloads from './Downloads/Downloads.component';
import Podcast from './Podcast/Podcast.component';
import Playing from './Playing/Playing.component';
import Clips from './Clips/Clips.component';
import Tags from './Tags/Tags.component';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CurrentlyPlaying {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: variables.ACTIVE_COLOR,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Clips" component={Clips} />
      <Tab.Screen name="Downloads" component={Downloads} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default AppNavigator;