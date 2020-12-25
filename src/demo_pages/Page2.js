import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

export default class Page2 extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Page2</Text>
      <Button title="Go back" onPress={() => {
        navigation.goBack();
      }} />
      <Button title="页面1" onPress={() => {
        navigation.navigate('Page1');
      }} />
      <Button title="页面3" onPress={() => {
        navigation.navigate('Page3');
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
