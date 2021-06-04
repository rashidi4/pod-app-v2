import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppNavigator from './pages';
import AuthLoadingScreen from './pages/Auth/Loading.component';
import AuthLogin from './pages/Auth/SignIn.component';
import AuthSignUp from './pages/Auth/SignUp.component';



export default createAppContainer(createSwitchNavigator(
  {
     AuthLoading: AuthLoadingScreen,
     Login: AuthLogin,
     SignUp: AuthSignUp,

     App: AppNavigator,
     // Auth: AuthStack,
  },
  {
     initialRouteName: 'AuthLoading',
  }
));
