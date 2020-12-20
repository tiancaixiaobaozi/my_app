import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

export default class Page4 extends React.Component{
  render() {
    const { navigation } = this.props;
    return (<View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text style={styles.text}>Page4</Text>
      <Button title="Go back" onPress={() => {
        navigation.goBack();
      }} />
    </View>);
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white',
  },
});
