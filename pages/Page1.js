import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

export default class Page1 extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Page1</Text>
      <Button title="Go back" onPress={() => {
        navigation.goBack();
      }} />
      <Button title="页面2" onPress={() => {
        navigation.navigate('Page2');
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
