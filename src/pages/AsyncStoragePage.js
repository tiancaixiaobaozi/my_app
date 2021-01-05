import React from 'react';
import { View, StyleSheet, TextInput, Text, Button, AsyncStorage } from 'react-native';
// @react-native-community/async-storage 代替 AsyncStorage

export default class AsyncStoragePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }

  doSave = () => {
    AsyncStorage.setItem('save_key', this.value);
  }
  doRemove = () => {
    AsyncStorage.removeItem('save_key');
  }
  doGet = () => {
    AsyncStorage.getItem('save_key').then(res => {
      this.setState({
        value: res,
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorage的使用</Text>
        <View style={styles.wrap}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.value = text;
            }}
          />
        </View>
        <View style={styles.wrap}>
          <Button title="存储" onPress={() => {
            this.doSave();
          }} />
          <Button title="删除" onPress={() => {
            this.doRemove();
          }} />
          <Button title="获取" onPress={() => {
            this.doGet();
          }} />
        </View>
        <Text>{this.state.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 50,
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10,
  },
});
