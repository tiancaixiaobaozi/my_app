import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';

export default class Page4 extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Page4</Text>
      <Button title="打开抽屉" onPress={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }} />
      <Button title="切换抽屉状态" onPress={() => {
        navigation.toggleDrawer();
      }} />
      <Button title="Page5" onPress={() => {
        navigation.navigate('Page5');
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
