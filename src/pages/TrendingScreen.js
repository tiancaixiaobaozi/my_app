import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrendingItem from '../components/TrendingItem';
import NavigationBar from '../components/NavigationBar';
import TrendingDialog, { TimeSpans } from '../components/TrendingDialog';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import { FLAG_STORE } from '../utils/DataStoreUtil';
import FavoriteUtil from '../utils/FavoriteUtil';

const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';
const PAGE_SIZE = 10;
const EVENT_TYPE_TIMESPAN_CHANGE = 'EVENT_TYPE_TIMESPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_trending);

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
  }
  componentDidMount() {
    this.loadData();
    // 监听一个特定的事件
    this.timeSpanListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIMESPAN_CHANGE, timeSpan => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
  }
  componentWillUnmount() {
    // 移除特定的事件监听
    if (this.timeSpanListener) {
      this.timeSpanListener.remove();
    }
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
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        PAGE_SIZE,
        store.items,
        favoriteDao,
        callback => {
          // 没有更多了，进入回调函数
          this.refs.toast.show('没有更多了~', 3000);
        }
      );
    } else {
      onLoadTrendingData(this.storeName, url, PAGE_SIZE, favoriteDao);
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
        projectModels: [],
        hideLoadingMore: true,
      };
    }
    return store;
  }

  /**
   * 根据label生成url
   * @param key
   * @return {string}
   */
  genFetchUrl(key) {
    return URL + key + '?' + this.timeSpan.searchText;
  }

  /**
   * 列表渲染item组件
   * @param data
   * @return {*}
   */
  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORE.flag_trending,
            callback,
          });
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORE.flag_trending);
        }}
      />
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
      );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={projectModel => this.renderItem(projectModel)}
          keyExtractor={projectModel => 't' + (projectModel.item.fullName || projectModel.item.id)}
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
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
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
  onLoadTrendingData: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onLoadTrendingData(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
    dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
});
const TrendingTabPage =  connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

export default class TrendingScreen extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['JavaScript', 'Vue', 'C#', 'C'];
    this.state = {
      timeSpan: TimeSpans[0],
    };
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }

  /**
   * 渲染头部
   * @return {*}
   */
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          underlayColor={'transparent'}
          onPress={() => this.dialog.show()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '400' }}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcon name={'arrow-drop-down'} size={22} style={{ color: '#fff' }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * 渲染dialog
   * @return {*}
   */
  renderTendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTime(tab)}
    />;
  }

  /**
   * 选择时间点
   * @param tab 选中的时间obj
   */
  onSelectTime(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab,
    });
    // 触发一个特定的事件
    DeviceEventEmitter.emit(EVENT_TYPE_TIMESPAN_CHANGE, tab);
  }

  /**
   * 优化判断tabNav是否存在
   * @return {NavigationContainer}
   * @private
   */
  _tabNav() {
    if (!this.tabNav) {
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
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
    }
    return this.tabNav;
  }

  render() {
    let barStyle = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title="趋势"
      statusBar={barStyle}
      style={{ backgroundColor: THEME_COLOR }}
      titleView={this.renderTitleView()}
    />;
    /**
     * 【优化】
     ** 避免每次state更新，tabNav都要重新创建一次
     ** 但是tabNav不更新，则不会刷新tabNav对应的列表
     ** 所以我们使用DeviceEventEmitter发送事件更新列表数据
     */
    const TabNavigator = this._tabNav();
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
        {this.renderTendingDialog()}
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
  },
});
