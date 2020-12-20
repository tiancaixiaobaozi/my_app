import React from 'react';
import {
  StyleSheet,
  View,
  Button,
} from 'react-native';
import { AppStackNavigator } from './navigator/AppNavigator';
import SwitchNavigator from './navigator/SwitchNavigator';
import { createAppContainer } from 'react-navigation';

class App extends React.Component{
  render() {
    const { navigation }  = this.props;
    return (
      <View style={styles.container}>
        <Button
          title="FlatListDemo"
          onPress={() => { navigation.navigate('FlatListDemo'); }}
        />
        <Button
          title="IconDemo"
          onPress={() => { navigation.navigate('IconDemo'); }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

// export default App;

// export default createAppContainer(AppStackNavigator);
export default createAppContainer(SwitchNavigator);
