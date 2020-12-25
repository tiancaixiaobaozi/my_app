import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

const CITY_NAMES = ['四川', '重庆', '广州', '深圳', '杭州', '苏州']

export default class FlatListDemo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataArray: CITY_NAMES,
    };
  }

  _renderItem(data) {
    return (<View style={styles.item}>
      <Text style={styles.text}>{data.item}</Text>
    </View>);
  }
  loadData() {
    this.setState({
      isLoading: true,
    });
    setTimeout(() => {
      let arr = [];
      for (let i = this.state.dataArray.length - 1; i >= 0; i--){
        arr.push(this.state.dataArray[i]);
      }
      this.setState({
        dataArray: arr,
        isLoading: false,
      });
    }, 2000);
  }
  loadMore() {
    let arr = this.state.dataArray;
    setTimeout(() => {
      arr.push('aaa');
    }, 2000);
    this.setState({
      dataArray: arr,
    });
  }
  genFooter() {
    return (<View style={styles.footerLoading}>
      <ActivityIndicator
        size="large"
        color="red"
        animating={true}
        style={styles.footerIndicator}
      />
      <Text style={styles.footerText}>正在加载...</Text>
    </View>);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataArray}
          renderItem={(data) => this._renderItem(data)}
          // refreshing={this.state.isLoading}
          // onRefresh={() => this.loadData()}
          refreshControl={
            // iOS, android参数差异
            <RefreshControl
              colors={['blue']}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
            />
          }
          ListFooterComponent={() => this.genFooter()}
          onEndReached={() => this.loadMore()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
  },
  item: {
    backgroundColor: '#cccfff',
    height: 200,
    marginHorizontal: 15,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'red',
    fontSize: 20,
  },
  footerLoading: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerIndicator: {
    color: 'green',
    marginBottom: 10,
  },
  footerText: {
    textAlign: 'center',
    color: 'green',
  },
});
