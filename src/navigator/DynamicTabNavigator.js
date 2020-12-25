import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntIcon from 'react-native-vector-icons/Entypo';
import PopularScreen from '../pages/PopularScreen';
import TrendingScreen from '../pages/TrendingScreen';
import FavoriteScreen from '../pages/FavoriteScreen';
import MyScreen from '../pages/MyScreen';
import {View} from 'react-native-reanimated';

// 在这里配置页面的路由
const TABS = {
  PopularPage: {
    screen: PopularScreen,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon name="whatshot" size={26} style={{ color: tintColor }} />
      ),
    },
  },
  TrendingPage: {
    screen: TrendingScreen,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({ tintColor, focused }) => (
        <IonIcon name="md-trending-up" size={26} style={{ color: tintColor }} />
      ),
    },
  },
  FavoritePage: {
    screen: FavoriteScreen,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon name="favorite" size={26} style={{ color: tintColor }} />
      ),
    },
  },
  MyPage: {
    screen: MyScreen,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ tintColor, focused }) => (
        <EntIcon name="user" size={26} style={{ color: tintColor }} />
      ),
    },
  },
};

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime(),
    };
  }
  render() {
    const { routes, index } = this.props.navigation.state;
    if (routes[index].params) {
      const { theme } = routes[index].params;
      // 以最新的更新时间为主，防止被其他tab之前的修改给覆盖
      if (theme && theme.updateTime > this.theme.updateTime) {
        this.theme = theme;
      }
    }
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.theme.tintColor || this.props.activeTintColor}
    />;
  }
}

export default class DynamicTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    // console.disableYellowBox = true;  // 关闭黄色警告框
  }
  _tabNavigator() {
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
    // PopularPage.navigationOptions.tabBarLabel = '动态'; // 动态修改tab属性
    return createAppContainer(createBottomTabNavigator(
      tabs,
      {
        tabBarComponent: TabBarComponent,
      }
    ));
  }
  render() {
    const Tab = this._tabNavigator();
    return <Tab />;
  }
}
