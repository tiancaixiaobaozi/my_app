import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

class PopularTab extends Component {
  render() {
    return (<View>
      <Text>PopularTab</Text>
      <Button title="跳转详情" onPress={() => {
        NavigationUtil.goPage('DetailPage');
      }} />
      <Button title="跳转Fetch" onPress={() => {
        NavigationUtil.goPage('FetchDemoPage');
      }} />
      <Button title="跳转Storage" onPress={() => {
        NavigationUtil.goPage('AsyncStoragePage');
      }} />
    </View>);
  }
}

export default class PopularScreen extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'iOS', 'React', 'PHP'];
  }

  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTab {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#a67',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }
    ));
    return (
      <View style={styles.container}>
        <TabNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
