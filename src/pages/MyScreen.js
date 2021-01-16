import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import actions from '../store/action';
import NavigationUtil from '../utils/NavigationUtil';
import NavigationBar from '../components/NavigationBar';
import { MORE_MENU } from '../config/MORE_MENU';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import { FLAG_LANGUAGE } from '../utils/LanguageDao';

class MyScreen extends Component {

  /**
   * 点击菜单
   * @param menu
   */
  onClick(menu) {
    const { theme } = this.props;
    let RouteName, params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://github.com/tiancaixiaobaozi';
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Remove_Key:
      case MORE_MENU.Custom_Language:
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language
          ? FLAG_LANGUAGE.flag_key
          : FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Sort_Key:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Theme:
        const { onShowCustomThemeView } = this.props;
        onShowCustomThemeView(true);
        break;
      default:
        break;
    }
    if (RouteName) {
      params.theme = theme;
      NavigationUtil.goPage(RouteName, params);
    }
  }

  /**
   * 生成菜单组件
   * @param menu
   */
  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, this.props.theme.themeColor);
  }

  render() {
    const { theme } = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title="我的"
        statusBar={statusBar}
        style={theme.styles.navBar}
      />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity style={styles.item} onPress={() => this.onClick(MORE_MENU.About)}>
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{ marginRight: 10, color: theme.themeColor }}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{ marginRight: 10, alignSelf: 'center', color: theme.themeColor }}
            />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {/*教程*/}
          {this.getItem(MORE_MENU.Tutorial)}

          <Text style={styles.group_title}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          <Text style={styles.group_title}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          <Text style={styles.group_title}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          {/*反馈*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Feedback)}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
});
const mapDispatchToProps = dispatch => ({
  handleThemeChange: theme => dispatch(actions.onThemeChange(theme)),
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  group_title: {
    margin: 10,
    fontSize: 12,
    color: 'gray',
  },
});
