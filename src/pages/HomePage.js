import React, { Component } from 'react';
import { connect } from 'react-redux';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../utils/NavigationUtil';
import BackPress from '../components/BackPress';
import { NavigationActions } from 'react-navigation';
import CustomTheme from '../components/CustomTheme';
import actions from '../store/action';
import SafeAreaViewPlus from '../components/SafeAreaViewPlus';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.backPress = new BackPress({ backPress: () => this.onBackPress() });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBackPress = () => {
    // console.log(this.props);
    // const { dispatch, nav } = this.props;
    // if (nav.routes[1].index === 0) {
    //   return false;
    // }
    // dispatch(NavigationActions.back());
    return false;
  }
  renderCustomThemeView() {
    const { customThemeViewVisible, onShowCustomThemeView } = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    );
  }

  render() {
    const { theme } = this.props;
    NavigationUtil.navigation = this.props.navigation;
    return (
      <SafeAreaViewPlus
        topColor={theme.themeColor}
      >
        <DynamicTabNavigator />
        {this.renderCustomThemeView()}
      </SafeAreaViewPlus>
    );
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
