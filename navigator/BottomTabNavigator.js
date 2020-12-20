import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';

export default createBottomTabNavigator(
  {
    Page1: {
      screen: Page1,
      navigationOptions: {
        tabBarLabel: 'Page1',
        tabBarIcon: ({ tintColor, focused }) => {
          return (<Icon
            name="ios-home"
            size={26}
            style={{ color: tintColor }}
          />);
        },
      },
    },
    Page2: {
      screen: Page2,
      navigationOptions: {
        tabBarLabel: ({ tintColor, focused }) => (
          // 自定义tab文字组件
          <Text
            style={{ color: focused ? 'orange' : 'grey',
              fontSize: 12,
              textAlign: 'center',
            }}
          >自定义</Text>
        ),
        tabBarIcon: ({ tintColor, focused }) => {
          return (<Icon
            name="ios-people"
            size={26}
            style={{ color: focused ? 'orange' : 'grey' }}
          />);
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: 'red', // tabBar的激活颜色
    },
  }
);
