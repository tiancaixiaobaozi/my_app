import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

class PopularTab extends Component {
  render() {
    return (<View>
      <Text>PopularTab</Text>
    </View>);
  }
}

export default class PopularScreen extends Component {
  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      {
        PopularTab1: {
          screen: PopularTab,
          navigationOptions: {
            title: 'Tab1',
          },
        },
        PopularTab2: {
          screen: PopularTab,
          navigationOptions: {
            title: 'Tab2',
          },
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
});
