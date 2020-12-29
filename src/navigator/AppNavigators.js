import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';
import FetchDemoPage from '../pages/FetchDemoPage';
import AsyncStoragePage from '../pages/AsyncStoragePage';

const InitNavigator = createStackNavigator(
  {
    WelcomePage: {
      screen: WelcomePage,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
);

const MainNavigator = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        headerShown: false,
      },
    },
    DetailPage: DetailPage,
    FetchDemoPage: FetchDemoPage,
    AsyncStoragePage: AsyncStoragePage,
  },
);

export default createAppContainer(createSwitchNavigator(
  {
    Init: InitNavigator,
    Main: MainNavigator,
  },
  {
    navigationOptions: {
      headerShown: false,
    },
  }
));
