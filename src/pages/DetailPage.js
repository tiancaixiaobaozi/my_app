import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from '../components/NavigationBar';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';
import FavoriteDao from '../utils/FavoriteDao';
import SafeAreaViewPlus from '../components/SafeAreaViewPlus';

const TRENDING_URL = 'https://github.com/';

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const { projectModel, flag } = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  onFavoriteButtonClick() {
    const { projectModel, callback } = this.params;
    projectModel.isFavorite = !projectModel.isFavorite;
    const isFavorite = projectModel.isFavorite;
    callback(isFavorite); // 通知上级页面收藏状态
    this.setState({
      isFavorite,
    });
    // tag: fullName收藏问题
    // let key = projectModel.item.fullName
    //   ? projectModel.item.fullName
    //   : projectModel.item.id.toString();
    let key = projectModel.item.id.toString();
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  renderRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => {
          this.onFavoriteButtonClick();
        }}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{ color: '#fff', marginRight: 10 }}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {})}
      </View>
    );
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }

  render() {
    const { theme } = this.params;
    const titleLayoutStyle = this.state.title.length > 20
      ? { paddingRight: 30 }
      : null;
    let navigationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={this.renderRightButton()}
      titleLayoutStyle={titleLayoutStyle}
      style={theme.styles.navBar}
    />;

    return (
      <SafeAreaViewPlus topColor={theme.themeColor}>
        {navigationBar}
        <WebView
          ref={webview => this.webview = webview}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </SafeAreaViewPlus>
    );
  }
}
