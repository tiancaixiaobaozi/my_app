import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class TrendingScreen extends Component {
  _setTheme = (set, color = 'blue') => {
    set({
      theme: {
        tintColor: color,
        updateTime: new Date().getTime(),
      },
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
        <Button title="修改红色主题" onPress={() => this._setTheme(navigation.setParams, 'red')} />
        <Button title="修改绿色主题" onPress={() => this._setTheme(navigation.setParams, 'green')} />
        <Button title="修改橘色主题" onPress={() => this._setTheme(navigation.setParams, 'orange')} />
      </View>
    );
  }
}

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
});
