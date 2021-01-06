import React, { Component } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import TrendingItem from '../components/TrendingItem';
import NavigationBar from '../components/NavigationBar';

const URL = 'https://github.com/trending/';
const QUERY_STR = '?since=daily';
const THEME_COLOR = '#678';
const PAGE_SIZE = 10;

class TrendingTab extends Component {
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
    const { onLoadTrendingData, onLoadMoreTrending } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, PAGE_SIZE, store.items, callback => {
        // 没有更多了，进入回调函数
        this.refs.toast.show('没有更多了~', 3000);
      })
    } else {
      onLoadTrendingData(this.storeName, url, PAGE_SIZE);
    }
  }

  /**
   * 返回当前label对应的store数据
   * @private
   */
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
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
      <TrendingItem item={item} onSelect={() => {}} />
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
          keyExtractor={item => 't' + (item.fullName || item.id)}
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
  trending: state.trending,
});
const mapDispatchToProps = dispatch => ({
  onLoadTrendingData: (storeName, url, pageSize) =>
    dispatch(actions.onLoadTrendingData(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callback)),
});
const TrendingTabPage =  connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

export default class TrendingScreen extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['JavaScript', 'Vue', 'React', 'C'];
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    let barStyle={
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    }
    let navigationBar = <NavigationBar
      title="趋势"
      statusBar={barStyle}
      style={{ backgroundColor: THEME_COLOR }}
    />;
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: THEME_COLOR,
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }
    ));
    return (
      <View style={styles.container}>
        {navigationBar}
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
    minWidth: 150,
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
