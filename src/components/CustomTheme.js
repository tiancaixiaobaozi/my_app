import React, { Component } from 'react';
import { Modal, TouchableOpacity, StyleSheet, View, Text, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ThemeDao from '../utils/ThemeDao';
import GlobalStyles from '../res/style/GlobalStyles';

export default class CustomTheme extends Component {
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
    return (
      this.props.visible
        ? <View style={GlobalStyles.root_container}>{this.renderContentView()}</View>
        : null
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    alignItems: 'center',
  },
  arrow: {
    marginTop: 40,
    color: '#fff',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
})
