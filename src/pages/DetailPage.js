import React, { Component } from 'react';
import { DeviceInfo, StyleSheet, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from '../components/NavigationBar';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const { projectModel } = this.params;
    this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  renderRightButton() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome name={'star-o'} size={20} style={{ color: '#fff', marginRight: 10 }} />
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
    const titleLayoutStyle = this.state.title.length > 20
      ? { paddingRight: 30 }
      : null;
    let navigationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={this.renderRightButton()}
      titleLayoutStyle={titleLayoutStyle}
      style={{ backgroundColor: THEME_COLOR }}
    />;

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webview => this.webview = webview}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange()}
          source={{ uri: this.state.url }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
  },
});
