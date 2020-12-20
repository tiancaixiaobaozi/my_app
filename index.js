import { AppRegistry } from 'react-native';
import { createAppContainer } from 'react-navigation';
import App from './App';
import FlatListDemo from './pages/FlatListDemo';
import IconDemo from './pages/IconDemo';
import { name as appName } from './app.json';
import { createStackNavigator } from 'react-navigation-stack';

const AppRoot = createStackNavigator({
  App: { screen: App },
  FlatListDemo: {
    screen: FlatListDemo,
    navigationOptions: {
      title: 'FlatListDemo',
    },
  },
  IconDemo: {
    screen: IconDemo,
    navigationOptions: {
      title: 'IconDemo',
    },
  },
}, {
  initialRouteName: 'App',
});

// AppRegistry.registerComponent(appName, () => createAppContainer(AppRoot));
// TODO 验证：将AppNavigator放在App创建则页面的navigationOptions才有效，放在index直接创建则无效
AppRegistry.registerComponent(appName, () => App);
