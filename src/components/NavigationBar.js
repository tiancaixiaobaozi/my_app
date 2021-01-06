import React, { Component } from 'react';
import { Platform, ViewPropTypes, StyleSheet, View, StatusBar, Text } from 'react-native';
import PropTypes from 'prop-types';

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarShape = {
  // 设置状态栏需要接收的属性
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.boolean,
  backgroundColor: PropTypes.string,
}

export default class NavigationBar extends Component {
  // 提供属性类型检查
  static propsTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.boolean,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  };
  // 设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    }
  };

  getButtonElement(data) {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }

  render() {
    let statusBar = this.props.statusBar.hidden
      ? null
      : (
        <View style={styles.statusBar}>
          <StatusBar {...this.props.statusBar} />
        </View>
      );

    let titleView = this.props.titleView
      ? this.props.titleView
      : (
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
          {this.props.title}
        </Text>
      );

    let content = this.props.hide
      ? null
      : (
        <View style={styles.navBar}>
          {this.getButtonElement(this.props.leftButton)}
          <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
            {titleView}
          </View>
          {this.getButtonElement(this.props.rightButton)}
        </View>
      );

    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarButton: {
    alignItems: 'center',
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
});
