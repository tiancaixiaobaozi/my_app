import React, { Component } from 'react';
import { FlatList, StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Toast from 'react-native-easy-toast';
import PopularItem from '../components/PopularItem';
import NavigationBar from '../components/NavigationBar';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import { FLAG_STORE } from '../utils/DataStoreUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import TrendingItem from '../components/TrendingItem';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const PAGE_SIZE = 10;
const favoriteDao = new FavoriteDao(FLAG_STORE.flag_popular);

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const { flag } = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData();
  }

  /**
   * 加载数据
   * @param loadMore
   */
  loadData(isShowLoading) {
    const { onLoadFavoriteData } = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 返回当前label对应的store数据
   * @private
   */
  _store() {
    const { favorite } = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      };
    }
    return store;
  }

  /**
   * 列表渲染item组件
   * @param data
   * @return {*}
   */
  renderItem(data) {
    const item = data.item;
    const Item = this.storeName === FLAG_STORE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage('DetailPage', {
            projectModel: item,
            flag: FLAG_STORE.flag_popular,
            callback,
          });
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORE.flag_popular);
        }}
      />
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={projectModel => this.renderItem(projectModel)}
          keyExtractor={projectModel => 't' + projectModel.item.id || projectModel.item.fullName}
          refreshControl={
            <RefreshControl
              title="Loading"
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  favorite: state.favorite,
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});
const FavoriteTabPage =  connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

export default class FavoriteScreen extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['最热', '趋势'];
  }
  render() {
    let barStyle = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title="收藏"
      statusBar={barStyle}
      style={{ backgroundColor: THEME_COLOR }}
    />;
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      {
        'Popular': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORE.flag_popular} />,
          navigationOptions: {
            title: '最热',
          },
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORE.flag_trending} />,
          navigationOptions: {
            title: '趋势',
          },
        },
      },
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
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
