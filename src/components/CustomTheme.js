import React, { Component } from 'react';
import { Modal, TouchableHighlight, StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/action';
import ThemeDao from '../utils/ThemeDao';
import GlobalStyles from '../res/style/GlobalStyles';
import ThemeFactory, { ThemeFlags } from '../res/style/ThemeFactory';

class CustomTheme extends Component {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }

  show() {
    this.setState({
      visible: true,
    })
  }
  dismiss() {
    this.setState({
      visible: false,
    })
  }

  /**
   * 选择主题
   * @param themeKey
   */
  onSelectTheme(themeKey) {
    this.props.onClose();
    this.themeDao.save(ThemeFlags[themeKey]);
    const { onThemeChange } = this.props;
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
  }
  getThemeItem(themeKey) {
    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        underlayColor={'#fff'}
        onPress={() => this.onSelectTheme(themeKey)}
      >
        <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
          <Text style={styles.themeText}>{themeKey}</Text>
        </View>
      </TouchableHighlight>
    );
  }
  renderThemeItems() {
    let views = [];
    for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
      views.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          {this.getThemeItem(keys[i])}
          {this.getThemeItem(keys[i + 1])}
          {this.getThemeItem(keys[i + 2])}
        </View>
      );
    }
    return views;
  }
  renderContentView() {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose();
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {this.renderThemeItems()}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  render() {
    console.log('visible:::', this.props.visible);
    return (
      this.props.visible
        ? <View style={GlobalStyles.root_container}>{this.renderContentView()}</View>
        : null
    );
  }
}
const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});
export default connect(null, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 10,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3,
  },
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
})
