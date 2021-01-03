import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';

class PopularTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { onLoadPopularData } = this.props;
    const url = this.genFetchUrl(this.storeName);
    onLoadPopularData(this.storeName, url);
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const item = data.item;
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={{ backgroundColor: '#faa' }}>
          {JSON.stringify(item)}
        </Text>
      </View>
    );
  }
  render() {
    const { popular } = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
      };
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={store.items}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              title="Loading"
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url)),
});
const PopularTabPage =  connect(mapStateToProps, mapDispatchToProps)(PopularTab);

export default class PopularScreen extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'iOS', 'React', 'PHP'];
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#a67',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }
    ));
    return (
      <View style={styles.container}>
        <TabNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
});
