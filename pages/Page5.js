import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

export default class Page5 extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'orange' }}>
      <Text style={styles.text}>Page5</Text>
      <Button title="打开抽屉" onPress={() => {
        navigation.openDrawer();
      }} />
      <Button title="切换抽屉状态" onPress={() => {
        navigation.toggleDrawer();
      }} />
      <Button title="Page4" onPress={() => {
        navigation.navigate('Page4');
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
