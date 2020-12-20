import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default class Login extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Login</Text>
      <Button title="登录" onPress={() => {
        navigation.navigate('App');
      }} />
    </View>);
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white',
  },
});
