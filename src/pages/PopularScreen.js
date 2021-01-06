import React, { Component } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import PopularItem from '../components/PopularItem';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = 'red';
const PAGE_SIZE = 10;

class PopularTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }

  /**
   * 加载数据
   * @param loadMore
   */
  loadData(loadMore) {
    const { onLoadPopularData, onLoadMorePopular } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, callback => {
        // 没有更多了，进入回调函数
        this.refs.toast.show('没有更多了~', 3000);
      })
    } else {
      onLoadPopularData(this.storeName, url, PAGE_SIZE);
    }
  }

  /**
   * 返回当前label对应的store数据
   * @private
   */
  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [],
        hideLoadingMore: true,
      }
    }
    return store;
  }

  /**
   * 根据label生成url
   * @param key
   * @return {string}
   */
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  /**
   * 列表渲染item组件
   * @param data
   * @return {*}
   */
  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem item={item} onSelect={() => {}} />
    );
  }

  /**
   * 列表渲染尾部刷新组件
   * @return {*}
   */
  renderIndicator() {
    return this._store().hideLoadingMore
      ? null
      : (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator style={styles.indicator} color="orange" />
        </View>
      )
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => 't' + item.id}
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
          ListFooterComponent={() => this.renderIndicator()}
          onEndReached={() => {
            // 保证onEndReached在onMomentumScrollBegin之后执行
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false;
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            // fix react-native 5.x 初始化时滚动调用onEndReached会调用两次
            this.canLoadMore = true;
          }}
        />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url, pageSize) =>
    dispatch(actions.onLoadPopularData(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback)),
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
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    margin: 10,
  }
});
