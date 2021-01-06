import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';

export default class TrendingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
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
