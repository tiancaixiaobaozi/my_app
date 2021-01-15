import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomePage from '../pages/WelcomePage';
import HomePage from '../pages/HomePage';
import DetailPage from '../pages/DetailPage';
import FetchDemoPage from '../pages/FetchDemoPage';
import AsyncStoragePage from '../pages/AsyncStoragePage';
import DataStorePage from '../pages/DataStorePage';
import WebViewPage from '../pages/WebViewPage';
import AboutPage from '../pages/AboutPage';
import AboutMePage from '../pages/AboutMePage';
import CustomKeyPage from '../pages/CustomKeyPage';
import SortKeyPage from '../pages/SortKeyPage';

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
    DetailPage: {
      screen: DetailPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    WebViewPage: {
      screen: WebViewPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    AboutPage: {
      screen: AboutPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    AboutMePage: {
      screen: AboutMePage,
      navigationOptions: {
        headerShown: false,
      },
    },
    CustomKeyPage: {
      screen: CustomKeyPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    SortKeyPage: {
      screen: SortKeyPage,
      navigationOptions: {
        headerShown: false,
      },
    },
    FetchDemoPage: FetchDemoPage,
    AsyncStoragePage: AsyncStoragePage,
    DataStorePage: DataStorePage,
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
