import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import actions from '../store/action';
import NavigationUtil from '../utils/NavigationUtil';
import NavigationBar from '../components/NavigationBar';

const THEME_COLOR = '#678';
type Props = {};

class MyScreen extends Component<Props> {
  constructor(props) {
    super(props);
  }

  getRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => {}}>
          <View style={{ padding: 5, marginRight: 8 }}>
            <IconFeather name="search" size={24} style={{ color: '#fff' }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  getLeftButton(callback) {
    return (
      <TouchableOpacity style={{ padding: 8, marginLeft: 8 }} onPress={callback}>
        <IconIonicons name="ios-arrow-back" size={26} style={{ color: '#fff' }} />
      </TouchableOpacity>
    );
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
        rightButton={this.getRightButton()}
        leftButton={this.getLeftButton()}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        {navigationBar}
        <View style={styles.container}>
          <View>
            <Text style={styles.welcome}>MyScreen</Text>
            <Button title="跳转详情" onPress={() => {
              NavigationUtil.goPage('DetailPage');
            }} />
            <Button title="跳转Fetch" onPress={() => {
              NavigationUtil.goPage('FetchDemoPage');
            }} />
            <Button title="跳转Storage" onPress={() => {
              NavigationUtil.goPage('AsyncStoragePage');
            }} />
            <Button title="离线缓存" onPress={() => {
              NavigationUtil.goPage('DataStorePage');
            }} />
          </View>
          <Button title="修改红色主题" onPress={() => this.props.handleThemeChange('red')} />
          <Button title="修改绿色主题" onPress={() => this.props.handleThemeChange('green')} />
          <Button title="修改橘色主题" onPress={() => this.props.handleThemeChange('orange')} />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
});
