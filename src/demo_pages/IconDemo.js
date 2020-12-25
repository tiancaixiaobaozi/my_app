import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class IconListDemo extends React.Component{
  render() {
    return (
      <View style={styles.container}>
        <Text>矢量图标</Text>
        <Text>配置请参考github步骤</Text>
        <Text>TODO： 验证android 是否需要拷贝node_modules/Font文件到asset?</Text>
        <Icon name="alarm-outline" size={35} color="orange" />
        <Icon name="aperture" size={45} color="#cccfff" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
});
