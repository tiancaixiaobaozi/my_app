import React, { Component } from 'react';
import { StyleSheet, View, Alert, TouchableHighlight, Text } from 'react-native';
// import SortableListView from 'react-native-sortable-listview';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import actions from '../store/action';
import NavigationBar from '../components/NavigationBar';
import LanguageDao, { FLAG_LANGUAGE } from '../utils/LanguageDao';
import BackPress from '../components/BackPress';
import ViewUtil from '../utils/ViewUtil';
import NavigationUtil from '../utils/NavigationUtil';
import ArrayUtil from '../utils/ArrayUtil';

const THEME_COLOR = '#678';

class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPress({
      backPress: (e) => this.onBackPress(e),
    });
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props), // 存放已选择了的标签集合
    };
  }
  // 从props中获取state
  static getDerivedStateFromProps(nextProps, prevState) {
    const checkArray = SortKeyPage._keys(nextProps, prevState);
    if (prevState.keys !== checkArray) {
      return {
        keys: checkArray,
      };
    }
    return null;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    // 如果props中的标签为空则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let { onLoadLanguage } = this.props;
      onLoadLanguage(this.params.flag);
    }
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 获取标签
   * @param props this.props
   * @param state
   * @returns {*}
   * @private
   */
  static _keys(props, state) {
    // 如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    // 否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props);
    let dataArray = props.language[flag] || [];
    let keys = [];
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i];
      if (data.checked) keys.push(data);
    }
    return keys;
  }
  static _flag(props) {
    const { flag } = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }
  onBackPress(e) {
    this.onBack();
    return true;
  }

  /**
   * 返回
   */
  onBack() {
    if (this.state.checkedArray.length > 0) {
      Alert.alert('提示', '是否保存修改？', [
        {
          text: '否',
          onPress: () => {
            NavigationUtil.goBack(this.props.navigation);
          },
        },
        {
          text: '是',
          onPress: () => {
            this.onSave();
          },
        },
      ]);
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  /**
   * 保存
   */
  onSave(hasChecked) {
    if (!hasChecked) {
      // 如果没有排序直接返回
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation);
        return;
      }
    }
    // todo 保存排序后的数据
    // 获取排序后的数据
    this.languageDao.save(keys || this.state.keys); // 更新本地数据
    const { onLoadLanguage } = this.props;
    onLoadLanguage(this.params.flag); // 更新store
    NavigationUtil.goBack(this.props.navigation);
  }

  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
    let navigationBar = <NavigationBar
      title={title}
      style={{ backgroundColor: THEME_COLOR }}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
    />;
    return (
      <View style={styles.container}>
        {navigationBar}
        {/* TODO rn16.3 暂不支持 */}
        {/*<SortableListView*/}
        {/*  data={this.state.checkedArray}*/}
        {/*  order={Object.keys(this.state.checkedArray)}*/}
        {/*  onRowMoved={e => {*/}
        {/*    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])*/}
        {/*    this.forceUpdate()*/}
        {/*  }}*/}
        {/*  renderRow={row => <SortCell data={row} {...this.params} />}*/}
        {/*/>*/}
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage);

class SortCell extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        style={this.props.data.checked ? styles.item : styles.hidden}
        {...this.props.sortHandlers}
      >
        <View style={{ marginLeft: 10, flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name={'sort'}
            size={16}
            style={{ marginRight: 10, color: THEME_COLOR }}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hidden: {
    height: 0,
  },
  item: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  }
});
