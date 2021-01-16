import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import actions from '../store/action';
import NavigationBar from '../components/NavigationBar';
import LanguageDao, { FLAG_LANGUAGE } from '../utils/LanguageDao';
import BackPress from '../components/BackPress';
import ViewUtil from '../utils/ViewUtil';
import GlobalStyles from '../res/style/GlobalStyles';
import NavigationUtil from '../utils/NavigationUtil';
import ArrayUtil from '../utils/ArrayUtil';

class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPress({
      backPress: (e) => this.onBackPress(e),
    });
    this.changeValues = []; // 保存页面选项是否改变
    this.isRemoveKey = !!this.params.isRemoveKey; // 是否显示标签移除
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      keys: [],
    };
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    // 如果props中的标签为空则从本地存储中获取标签
    if (CustomKeyPage._keys(this.props).length === 0) {
      let { onLoadLanguage } = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props),
    });
  }
  // 从props中获取state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState),
      };
    }
    return null;
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 获取标签
   * @param props this.props
   * @param original 移除标签时使用，是否从props获取原始对的标签
   * @param state 移除标签时使用
   * @returns {*}
   * @private
   */
  static _keys(props, original, state) {
    const { flag, isRemoveKey } = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      return state && state.keys
        && state.keys.length !== 0
        || props.language[key].map(val => {
          return {
            // 不直接修改props, copy一份
            ...val,
            checked: false,
          };
        });
    } else {
      return props.language[key];
    }
  }
  onBackPress(e) {
    this.onBack();
    return true;
  }

  /**
   * 返回
   */
  onBack() {
    if (this.changeValues.length > 0) {
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
  onSave() {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation);
      return;
    }
    let keys;
    if (this.isRemoveKey) {
      // 移除标签
      for (let i = 0, l = this.changeValues.length; i < l; i++) {
        ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], 'name');
      }
    }
    this.languageDao.save(keys || this.state.keys); // 更新本地数据
    const { onLoadLanguage } = this.props;
    onLoadLanguage(this.params.flag); // 更新store
    NavigationUtil.goBack(this.props.navigation);
  }

  /**
   * 生成checkbox图标
   * @param checked
   * @return {*}
   * @private
   */
  _checkedImage(checked) {
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{ color: this.params.theme.themeColor }}
    />;
  }

  /**
   * 渲染checkbox组件
   * @param data
   * @param index
   * @return {*}
   */
  renderCheckBox(data, index) {
    return <CheckBox
      style={{ flex: 1, padding: 10 }}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      rightText={data.name}
      checkedImage={this._checkedImage(true)}
      unCheckedImage={this._checkedImage(false)}
    />;
  }

  /**
   * 点击checkbox
   * @param data
   * @param index
   */
  onClick(data, index) {
    data.checked = !data.checked;
    ArrayUtil.updateArray(this.changeValues, data);
    this.state.keys[index] = data;
    //更新state显示选中状态
    this.setState({
      keys: this.state.keys,
    });
  }
  renderView() {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) return;
    let len = dataArray.length;
    let views = [];
    for (let i = 0; i < len; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={GlobalStyles.line} />
        </View>
      );
    }
    return views;
  }

  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
    let navigationBar = <NavigationBar
      title={title}
      style={{ backgroundColor: this.params.theme.themeColor }}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
    />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <ScrollView>
          {this.renderView()}
        </ScrollView>
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
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
});
