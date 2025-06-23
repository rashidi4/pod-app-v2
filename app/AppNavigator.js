import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './pages';
import AuthLoadingScreen from './pages/Auth/Loading.component';
import AuthLogin from './pages/Auth/SignIn.component';
import AuthSignUp from './pages/Auth/SignUp.component';

const Stack = createStackNavigator();

export default function AppNavigatorWrapper() {
  return (
    <Stack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="Login" component={AuthLogin} />
      <Stack.Screen name="SignUp" component={AuthSignUp} />
      <Stack.Screen name="App" component={AppNavigator} />
    </Stack.Navigator>
  );
}