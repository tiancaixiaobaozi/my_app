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
import EventBus from 'react-native-event-bus';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrendingItem from '../components/TrendingItem';
import NavigationBar from '../components/NavigationBar';
import TrendingDialog, { TimeSpans } from '../components/TrendingDialog';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import { FLAG_STORE } from '../utils/DataStoreUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import EventTypes from '../utils/EventTypes';
import { FLAG_LANGUAGE } from '../utils/LanguageDao';
import ArrayUtil from '../utils/ArrayUtil';

const URL = 'https://github.com/trending/';
const PAGE_SIZE = 10;
const EVENT_TYPE_TIMESPAN_CHANGE = 'EVENT_TYPE_TIMESPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_trending);

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel, timeSpan } = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    // 监听一个特定的事件
    this.timeSpanListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIMESPAN_CHANGE, timeSpan => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
    EventBus.getInstance().addListener(EventTypes.FAVORITE_CHANGED_TRENDING, this.favoriteListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.BOTTOM_TAB_SELECT, this.bottomListener = data => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(false, true);
      }
    })
  }
  componentWillUnmount() {
    // 移除特定的事件监听
    if (this.timeSpanListener) {
      this.timeSpanListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteListener);
    EventBus.getInstance().removeListener(this.bottomListener);
  }

  /**
   * 加载数据
   * @param loadMore
   * @param refreshFavorite
   */
  loadData(loadMore, refreshFavorite) {
    const { onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
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
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao);
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
    const { theme } = this.props;
    return (
      <TrendingItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            theme,
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
    const { theme } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={projectModel => this.renderItem(projectModel)}
          keyExtractor={projectModel => 't' + (projectModel.item.fullName || projectModel.item.id)}
          refreshControl={
            <RefreshControl
              title="Loading"
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
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
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) =>
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const TrendingTabPage =  connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

class TrendingScreen extends Component {
  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.state = {
      timeSpan: TimeSpans[0],
    };
    this.prevLanguages = [];
  }
  _getTabs() {
    const tabs = {};
    const { languages, theme } = this.props;
    this.prevLanguages = languages;
    languages.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage
            {...props}
            timeSpan={this.state.timeSpan}
            tabLabel={item.name}
            theme={theme}
          />,
          navigationOptions: {
            title: item.name,
          },
        };
      }
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
    const theme = this.props;
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.prevLanguages, this.props.languages)) {
      this.theme = theme;
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this._getTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: this.props.theme.themeColor,
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
          lazy: true,
        }
      ));
    }
    return this.tabNav;
  }

  render() {
    const { languages, theme } = this.props;
    let barStyle = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title="趋势"
      statusBar={barStyle}
      style={theme.styles.navBar}
      titleView={this.renderTitleView()}
    />;
    /**
     * 【优化】
     ** 避免每次state更新，tabNav都要重新创建一次
     ** 但是tabNav不更新，则不会刷新tabNav对应的列表
     ** 所以我们使用DeviceEventEmitter发送事件更新列表数据
     */
    const TabNavigator = languages.length ? this._tabNav() : null;
    return (
      <View style={styles.container}>
        {navigationBar}
        { TabNavigator && <TabNavigator /> }
        {this.renderTendingDialog()}
      </View>
    );
  }
}
const mapTrendingStateToProps = state => ({
  languages: state.language.languages,
  theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
