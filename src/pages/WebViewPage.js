import React, { Component } from 'react';
import { DeviceInfo, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import NavigationBar from '../components/NavigationBar';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';

export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const { title, url } = this.params;
    this.state = {
      title,
      url,
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

  /**
   * webview的回调
   * @param navState
   * {
   *   url?: string;
   *   title?: string;
   *   loading?: boolean;
   *   canGoBack?: boolean;
   *   canGoForward?: boolean;
   * }
   */
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }

  render() {
    const { theme } = this.params;
    let navigationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      style={theme.styles.navBar}
    />;

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webview => this.webview = webview}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
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
