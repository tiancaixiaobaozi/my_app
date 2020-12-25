import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Page1 from '../demo_pages/Page1';
import Page2 from '../demo_pages/Page2';
import Page3 from '../demo_pages/Page3';

export default createMaterialTopTabNavigator(
  {
    Page1: {
      screen: Page1,
      navigationOptions: {
        tabBarLabel: 'Page1',
      },
    },
    Page2: {
      screen: Page2,
      navigationOptions: {
        tabBarLabel: 'Page2',
      },
    },
    Page3: {
      screen: Page3,
      navigationOptions: {
        tabBarLabel: 'Page3',
      },
    },
  },
  {
    initialRouteName: 'Page1',
    order: ['Page3', 'Page2', 'Page1'],
    backBehavior: 'none',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    lazy: true,
    tabBarOptions: {
      style: {
        backgroundColor: '#879',
      },
      tabStyle: {
        minxWidth: 50,
      },
      indicatorStyle: {
        height: 2,
        backgroundColor: '#fff',
      },
      labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
      },
      upperCaseLabel: false,  // 标签英文大小写
    },
  }
);
