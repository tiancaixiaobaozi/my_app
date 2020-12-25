import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

export default class Home extends React.Component{
  // 自定义页面属性
  static navigationOptions = {
    title: 'Home',
    headerBackTitle: '自定义返回标题', // android不支持
  }
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Home</Text>
      <Button title="页面1（参数： name）" onPress={() => {
        navigation.navigate('Page1', { name: '动态title' });
      }} />
      <Button title="页面2" onPress={() => {
        navigation.navigate('Page2');
      }} />
      <Button title="页面3（参数： name）" onPress={() => {
        navigation.navigate('Page3', { name: '张三' });
      }} />
      <Button title="底部导航" onPress={() => {
        navigation.navigate('BottomTabDemo');
      }} />
      <Button title="顶部导航" onPress={() => {
        navigation.navigate('TopTabDemo');
      }} />
      <Button title="抽屉导航" onPress={() => {
        navigation.navigate('DrawerDemo');
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
