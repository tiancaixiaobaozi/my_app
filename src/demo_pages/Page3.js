import React from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';

export default class Page3 extends React.Component{
  render() {
    const { navigation } = this.props;
    const { state, setParams } = navigation;
    const { params } = state;
    const showText = params && params.mode === 'edit' ? '正在编辑' : '编辑完成';

    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Page3</Text>
      <Text style={styles.showText}>{ showText }</Text>
      <Button title="Go back" onPress={() => {
        navigation.goBack();
      }} />
      <Button title="页面1" onPress={() => {
        navigation.navigate('Page1');
      }} />
      <Button title="页面2" onPress={() => {
        navigation.navigate('Page2');
      }} />
      <TextInput
        style={styles.input}
        onChangeText={text => {
          setParams({ name: text });
        }}
      />
    </View>);
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white',
  },
  showText: {
    marginTop: 20,
    fontSize: 20,
    color: 'red',
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderColor: 'black',
  },
});
