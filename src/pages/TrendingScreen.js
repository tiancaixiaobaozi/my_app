import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';

class TrendingScreen extends Component {
  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
        <Button title="修改红色主题" onPress={() => this.props.handleThemeChange('red')} />
        <Button title="修改绿色主题" onPress={() => this.props.handleThemeChange('green')} />
        <Button title="修改橘色主题" onPress={() => this.props.handleThemeChange('orange')} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleThemeChange: theme => dispatch(actions.onThemeChange(theme))
})
export default connect(null, mapDispatchToProps)(TrendingScreen);

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
