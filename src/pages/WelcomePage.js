import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import NavigationUtil from '../utils/NavigationUtil';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      // 跳转首页
      SplashScreen.hide();
      NavigationUtil.resetToHomePage(this.props);
    }, 2000);
  }
  componentWillUnmount(): void {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return null;
  }
}
