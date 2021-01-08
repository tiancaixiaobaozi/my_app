import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    }
  }
  // props发生变化
  // old版本: componentWillReceiveProps(nextProps)
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite,
      }
    }
    return null;
  }

  /**
   * 收藏按钮组件
   * @return {*}
   * @private
   */
  _favoriteIcon() {
    return (
      <TouchableOpacity
        style={{ padding: 6 }}
        underlayColor={'transparent'}
        onPress={() => this.onPressFavorite()}
      >
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{ color: '#678' }}
        />
      </TouchableOpacity>
    );
  }

  /**
   * 更新当前收藏组件的状态
   */
  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite,
    });
  }

  /**
   * 点击一个item时的回调
   */
  onItemClick() {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite);
    });
  }

  /**
   * 点击收藏按钮回调
   */
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
}
