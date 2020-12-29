import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntIcon from 'react-native-vector-icons/Entypo';
import PopularScreen from '../pages/PopularScreen';
import TrendingScreen from '../pages/TrendingScreen';
import FavoriteScreen from '../pages/FavoriteScreen';
import MyScreen from '../pages/MyScreen';

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
  render() {
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />;
  }
}

class DynamicTabNavigator extends React.Component {
  constructor(props) {
    super(props);
    // console.disableYellowBox = true;  // 关闭黄色警告框
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
    // PopularPage.navigationOptions.tabBarLabel = '动态'; // 动态修改tab属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(
      tabs,
      {
        tabBarComponent: props => {
          return <TabBarComponent {...props} theme={this.props.theme} />
        },
      }
    ));
  }
  render() {
    const Tab = this._tabNavigator();
    return <Tab />;
  }
}

const mapStateToProps = state => ({
  theme: state.theme.color,
});
export default connect(mapStateToProps)(DynamicTabNavigator);
