import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';
import { AppStackNavigator } from './StackNavigator';
import Login from '../pages/Login';

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
  }
);

export default createSwitchNavigator(
  {
    // Auth: {
    //   screen: AuthStack,
    // },
    // 简写
    Auth: AuthStack,
    App: AppStackNavigator,
  }
);
