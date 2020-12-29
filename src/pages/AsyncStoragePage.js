import React from 'react';
import { View, StyleSheet, TextInput, Text, Button } from 'react-native';

export default class AsyncStoragePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }
  // 请求数据
  loadData() {
    let url = `https://api.github.com/search/repositories?q=java`;
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({
          showText: responseText,
        })
      })
  }
  // 模拟错误请求
  loadDataError() {
    let url = `https://api.github.com/search/repositories?q=java`;
    fetch(url)
      .then(response => {
        if(response.ok && false) {
          return response.text()
        }
        throw new Error('Network error!!!')
      })
      .then(responseText => {
        this.setState({
          showText: responseText,
        })
      })
      .catch(e => {
        this.setState({
          showText: e.toString(),
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fetch的使用</Text>
        <View style={styles.wrap}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text;
            }}
          />
          <Button title="获取" onPress={() => {
            this.loadDataError();
          }} />
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    )
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
