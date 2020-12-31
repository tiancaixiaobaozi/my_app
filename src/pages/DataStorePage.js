import React from 'react';
import { ScrollView, View, StyleSheet, TextInput, Text, Button } from 'react-native';
import DataStore from '../utils/DataStoreUtil';

export default class FetchDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
    this.dataStore = new DataStore();
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.value}`;
    this.dataStore.fetchData(url)
      .then(res => {
        const { timestamp, data } = res
        let showData = `初次数据加载时间${new Date(timestamp)}\n${JSON.stringify(data)}`;
        this.setState({
          showText: showData,
        })
      })
      .catch(e => {
        e && console.log(e.toString());
      })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.welcome}>离线缓存的使用</Text>
        <View style={styles.wrap}>
          <TextInput style={styles.input} onChangeText={text => {
            this.value = text;
          }} />
          <Button title="获取数据" onPress={() => {
            this.loadData();
          }} />
        </View>
        <Text>{this.state.showText}</Text>
      </ScrollView>
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
