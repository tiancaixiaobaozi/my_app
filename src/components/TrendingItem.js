import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import HtmlView from 'react-native-htmlview';
import BaseItem from './BaseItem';

export default class TrendingItem extends BaseItem {
  render() {
    const { projectModel } = this.props;
    const { item } = projectModel;
    if (!item) { return null; }
    const desc_str = `<p>${item.description}</p>`
    return (
      <TouchableOpacity
        onPress={() => this.onItemClick()}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HtmlView
            value={desc_str}
            onLinkPress={url => {}}
            stylesheet={{ p: styles.description, a: styles.description }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built By:</Text>
              {item.contributors.map((result, i, arr) => {
                return <Image
                  key={'avatar' + i}
                  style={{ width: 22, height: 22, margin: 2 }}
                  source={{ uri: arr[i] }}
                />
              })}
            </View>
            <View style={styles.row}>
              <Text>Start:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 2,
    // ios 设置阴影
    shadowColor: 'gray',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    // android 设置阴影
    elevation: 2,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
});
