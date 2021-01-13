import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import IconFeather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import actions from '../store/action';
import NavigationUtil from '../utils/NavigationUtil';
import NavigationBar from '../components/NavigationBar';
import { MORE_MENU } from '../config/MORE_MENU';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';

const THEME_COLOR = '#678';

class MyScreen extends Component {

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
      case MORE_MENU.About:
        RouteName = 'AboutPage';
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
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title="我的"
        statusBar={statusBar}
        style={{ backgroundColor: THEME_COLOR }}
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
                style={{ marginRight: 10, color: THEME_COLOR }}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{ marginRight: 10, alignSelf: 'center', color: THEME_COLOR }}
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

const mapDispatchToProps = dispatch => ({
  handleThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(null, mapDispatchToProps)(MyScreen);

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
