import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import Toast from 'react-native-easy-toast';
import PopularItem from '../components/PopularItem';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import { FLAG_STORE } from '../utils/DataStoreUtil';
import FavoriteUtil from '../utils/FavoriteUtil';
import LanguageDao, { FLAG_LANGUAGE } from '../utils/LanguageDao';
import BackPress from '../components/BackPress';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../utils/ViewUtil';
import ArrayUtil from '../utils/ArrayUtil';

const PAGE_SIZE = 10;

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPress({ backPress: e => this.onBackPress(e) });
    this.favoriteDao = new FavoriteDao(FLAG_STORE.flag_popular);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChnage = false; // 判断是否触发了底部的添加操作
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    this.loadData();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  loadData(loadMore) {
    const { onSearch, onLoadMoreSearch, search, keys } = this.props;
    if (loadMore) {
      onLoadMoreSearch(
        ++search.pageIndex,
        PAGE_SIZE,
        search.items,
        this.favoriteDao,
        callback => {
          // 没有更多了，进入回调函数
          this.toast.show('没有更多了~', 3000);
        }
      );
    } else {
      onSearch(
        this.inputKey,
        PAGE_SIZE,
        this.searchToken = new Date().getTime(),
        this.favoriteDao,
        keys, message => {
          this.toast.show(message);
        }
      );
    }
  }
  onBackPress() {
    const { onSearchCancel, onLoadLanguage, navigation } = this.props;
    onSearchCancel();
    this.refs.input.blur();
    NavigationUtil.goBack(navigation);
    if (this.isKeyChnage) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }
    return true;
  }
  renderItem(data) {
    const item = data.item;
    const { theme } = this.params;
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
          FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, FLAG_STORE.flag_popular);
        }}
      />
    );
  }
  renderIndicator() {
    return this.props.search.hideLoadingMore
      ? null
      : (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator style={styles.indicator} color="orange" />
        </View>
      );
  }
  renderNavBar() {
    const { theme } = this.params;
    const { showText, inputKey } = this.props.search;
    const placeholder = inputKey || '请输入';
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
    let inputView = <TextInput
      ref={'input'}
      placeholder={placeholder}
      onChangeText={text => this.inputKey = text}
      style={styles.textInput}
    />;
    let rightButton = <TouchableOpacity
      onPress={() => {
        this.refs.input.blur();
        this.onRightButtonClick();
      }}
    >
      <View style={{ marginRight: 10 }}>
        <Text style={styles.title}>{showText}</Text>
      </View>
    </TouchableOpacity>
    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      height: (Platform.OS === 'ios')
        ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>;
  }
  onRightButtonClick() {
    const { onSearchCancel, search } = this.props;
    if (search.showText === '搜索') {
      this.loadData();
    } else {
      onSearchCancel(this.searchToken);
    }
  }
  saveKey() {
    const { keys } = this.props;
    let key = this.inputKey;
    if (ArrayUtil.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在');
    } else {
      key = {
        path: key,
        name: key,
        checked: true,
      };
      keys.unshift(key);  // 添加到数组开头
      this.languageDao.save(keys);
      this.toast.show(key.name + '保存成功');
      this.isKeyChnage = true;
    }
  }

  render() {
    const { search } = this.props;
    const { theme } = this.params;
    const { isLoading, projectModels, showBottomButton, hideLoadingMore } = search;
    let statusBar = null;
    if (Platform === 'ios') {
      statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]} />
    }
    let listView = !isLoading ? <FlatList
      data={projectModels}
      renderItem={projectModel => this.renderItem(projectModel)}
      keyExtractor={projectModel => 't' + projectModel.item.id}
      contentInset={
        { bottom: 45 }
      }
      refreshControl={
        <RefreshControl
          title="Loading"
          titleColor={theme.themeColor}
          colors={[theme.themeColor]}
          refreshing={isLoading}
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
    /> : null;
    let bottomButton = showBottomButton ?
      (<TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.saveKey();
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.title}>朕收下了</Text>
        </View>
      </TouchableOpacity>) : null;
    let indicatorView = isLoading ?
      <ActivityIndicator
        style={styles.centering}
        size={'large'}
        animating={isLoading}
      /> : null;
    let resultView = <View style={{ flex: 1 }}>
      {indicatorView}
      {listView}
    </View>;

    return (
      <View style={styles.container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => this.toast = toast} position={'center'} />
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  search: state.search,
});
const mapPopularDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, toekn, favoriteDao, popularKeys, callback) =>
    dispatch(actions.onSearch(inputKey, pageSize, toekn, favoriteDao, popularKeys, callback)),
  onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) =>
    dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callback)),
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SearchPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statusBar: {
    height: 20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45,
    right: 10,
    borderRadius: 3,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: '#fff',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: '#fff',
  },
});
