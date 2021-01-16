import React, { Component } from 'react';
import { View, Linking } from 'react-native';
import NavigationUtil from '../utils/NavigationUtil';
import { MORE_MENU } from '../config/MORE_MENU';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import AboutCommon from '../components/AboutCommon';
import config from '../res/data/config.json';

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me',
};

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}));
    // aboutCommon 里面网络为请求配置，在这里预设置一个本地json_config
    this.state = {
      data: config,
    };
  }

  /**
   * 点击菜单
   * @param menu
   */
  onClick(menu) {
    let RouteName, params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://github.com/tiancaixiaobaozi';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Feedback:
        let url = 'mailto://mydoge@vip.qq.com';
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('无法发送邮件')
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
            console.error(e);
          });
        break;
      default:
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(RouteName, params);
    }
  }

  /**
   * 生成菜单组件
   * @param menu
   */
  getItem(menu) {
    return ViewUtil.getMenuItem(
      () => this.onClick(menu), menu, this.params.theme.themeColor
    );
  }

  render() {
    const content  = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
