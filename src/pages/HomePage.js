import React, { Component } from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../utils/NavigationUtil';
import BackPress from '../components/BackPress';
import { NavigationActions } from 'react-navigation';

export default class HomePage extends Component {
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

  render() {
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator />;
  }
}
