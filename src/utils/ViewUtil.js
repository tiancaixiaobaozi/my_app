import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
  /**
   * 左侧返回按钮
   * @param callback
   * @returns {*}
   */
  static getLeftBackButton(callback) {
    return (
      <TouchableOpacity
        style={{ padding: 8, marginLeft: 8 }}
        onPress={callback}
      >
        <Ionicons name={'ios-arrow-back'} size={26} style={{ color: '#fff' }} />
      </TouchableOpacity>
    );
  }

  /**
   * 获取分享按钮
   * @param callback
   * @returns {*}
   */
  static getShareButton(callback) {
    return (
      <TouchableOpacity
        underlayColor={'transparent'}
        onPress={callback}
      >
        <Ionicons
          name={'md-share'}
          size={20}
          style={{ opacity: 0.9, marginRight: 10, color: '#fff' }}
        />
      </TouchableOpacity>
    );
  }

  /**
   * 获取Cell组件
   * @param callback
   * @param text 文本
   * @param color 图标颜色
   * @param Icons 图标组件
   * @param icon 图标名称
   * @param expandableIcon 右侧图标
   * @returns {*}
   */
  static getSettingItem(callback, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callback}
        style={styles.setting_item_container}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          {
            Icons && icon
              ? <Icons name={icon} size={16} style={{ color: color, marginRight: 10 }} />
              : <View style={{ opacity: 1, width: 16, height: 16, marginRight: 10 }} />
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={16}
          style={{ marginRight: 10, alignSelf: 'center', color: color || '#000' }}
        />
      </TouchableOpacity>
    )
  }

  /**
   * 获取menu_item
   * @param callback
   * @param menu
   * @param color
   * @param expandableIcon
   */
  static getMenuItem(callback, menu, color, expandableIcon) {
    return ViewUtil.getSettingItem(
      callback,
      menu.name,
      color,
      menu.Icons,
      menu.icon,
      expandableIcon
    );
  }
}

const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
})
