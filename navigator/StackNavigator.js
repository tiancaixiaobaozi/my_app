import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import Home from '../pages/Home';
import BottomTabNavigator from './BottomTabNavigator';
import TopTabNavigator from './TopTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';
import Page3 from '../pages/Page3';

export const AppStackNavigator = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: '主页',
      },
    },
    BottomTabDemo: {
      screen: BottomTabNavigator,
    } ,
    TopTabDemo: {
      screen: TopTabNavigator,
      navigationOptions: {
        title: '顶部导航',
      },
    },
    DrawerDemo: {
      screen: DrawerNavigator,
      navigationOptions: {
        title: '抽屉页面',
      },
    },
    Page1: {
      screen: Page1,
      navigationOptions: ({ navigation }) => {
        return {
          title: navigation.state.params
            ? navigation.state.params.name
            : '默认',
        };
      },
    },
    Page2: {
      screen: Page2,
      navigationOptions: () => ({
        headerShown: false,
      }),
    },
    Page3: {
      screen: Page3,
      navigationOptions: (props) => {
        const { navigation } = props;
        const { state, setParams } = navigation;
        const { params = {} } = state;
        return {
          title: params.name
            ? params.name
            : 'Page3',
          headerRight: () => (
            <Button
              title={params.mode === 'edit' ? '保存' : '编辑'}
              onPress={() => {
                setParams({
                  mode: params.mode === 'edit' ? '' : 'edit',
                });
              }}
            />
          ),
        };
      },
    },
  },
  {
    defaultNavigationOptions: {
      //全局默认属性
      // headerShown: false,
    },
  }
);
