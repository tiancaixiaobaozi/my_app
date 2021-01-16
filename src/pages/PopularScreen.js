import React, { Component } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import EventBus from 'react-native-event-bus';
import PopularItem from '../components/PopularItem';
import NavigationBar from '../components/NavigationBar';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import { FLAG_STORE } from '../utils/DataStoreUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import EventTypes from '../utils/EventTypes';
import { FLAG_LANGUAGE } from '../utils/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const PAGE_SIZE = 10;
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_popular);

class PopularTab extends Component {
  constructor(props) {
    super(props);
    const { tabLabel } = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.FAVORITE_CHANGED_POPULAR, this.favoriteListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.BOTTOM_TAB_SELECT, this.bottomListener = data => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteListener);
    EventBus.getInstance().removeListener(this.bottomListener);
  }

  /**
   * 加载数据
   * @param loadMore
   * @param refreshFavorite 是否刷新收藏状态
   */
  loadData(loadMore, refreshFavorite) {
    const { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
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
      onFlushPopularFavorite(this.storeName, store.pageIndex, PAGE_SIZE, store.items, favoriteDao);
    } else {
      onLoadPopularData(this.storeName, url, PAGE_SIZE, favoriteDao);
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
    return URL + key + QUERY_STR;
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
      <PopularItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORE.flag_popular,
            theme,
            callback,
          });
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORE.flag_popular);
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
          keyExtractor={projectModel => 't' + projectModel.item.id}
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
  onLoadPopularData: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onLoadPopularData(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) =>
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const PopularTabPage =  connect(mapStateToProps, mapDispatchToProps)(PopularTab);

class PopularScreen extends Component {
  constructor(props) {
    super(props);
    const { onLoadLanguage } = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  _getTabs() {
    const tabs = {};
    const { keys, theme } = this.props;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme} />,
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }
  render() {
    const { keys, theme } = this.props;
    let barStyle = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title="最热"
      statusBar={barStyle}
      style={theme.styles.navBar}
    />;
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: theme.themeColor,
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
        lazy: true,
      }
    )) : null;
    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator &&  <TabNavigator />}
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularScreen);

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
  },
});
