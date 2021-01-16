import React, { Component } from 'react';
import { View, Linking, Clipboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import NavigationUtil from '../utils/NavigationUtil';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import AboutCommon from '../components/AboutCommon';
import config from '../res/data/config.json';

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me',
};

export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me,
    }, data => this.setState({...data}));
    // aboutCommon 里面网络为请求配置，在这里预设置一个本地json_config
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    };
  }

  /**
   * 点击菜单
   * @param tab
   */
  onClick(tab) {
    if (!tab) return;
    // 链接
    if (tab.url) {
      const { theme } = this.params;
      NavigationUtil.goPage('WebViewPage', {
        title: tab.title,
        url: tab.url,
        theme,
      });
    }
    // 邮箱
    if (tab.account && tab.account.indexOf('@') > -1) {
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
    }
    // 复制到剪贴板
    if (tab.account) {
      Clipboard.setString(tab.account);
      this.refs.toast.show('内容已复制到剪贴板！');
    }
  }

  /**
   * 生成菜单组件
   * @param data
   * @param isShow 是否显示下级菜单
   * @param key
   */
  _item(data, isShow, key) {
    const { theme } = this.params;
    return ViewUtil.getSettingItem(
      () => {
        this.setState({
          [key]: !this.state[key]
        })
      },
      data.name,
      theme.themeColor,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down'
    );
  }

  /**
   * 展示子列表数据
   * @param dic
   * @param isShowAccount
   */
  renderItems(dic, isShowAccount) {
    if (!dic) return null;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' +dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(
            () => this.onClick(dic[i]),
            title,
            this.params.theme.themeColor,
          )}
          <View style={GlobalStyles.line} />
        </View>
      );
    }
    return views;
  }

  render() {
    const content  = (
      <View>
        {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
        <View style={GlobalStyles.line} />
        {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null }

        {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
        <View style={GlobalStyles.line} />
        {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null }

        {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
        <View style={GlobalStyles.line} />
        {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null }

        {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
        <View style={GlobalStyles.line} />
        {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null }
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        {this.aboutCommon.render(content, this.state.data.author)}
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}
