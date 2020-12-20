import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Page4 from '../pages/Page4';
import Page5 from '../pages/Page5';

export default createDrawerNavigator(
  {
    Page4: {
      screen: Page4,
      navigationOptions: {
        drawerLabel: 'Page4',
        drawerIcon: ({ tintColor, foucsed }) => (
          <Icon
            name="drafts"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Page5: {
      screen: Page5,
      navigationOptions: {
        drawerLabel: 'Page5',
        drawerIcon: ({ tintColor, foucsed }) => (
          <Icon
            name="move-to-inbox"
            size={24}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    contentComponent: (props) => (
      // 自定义侧拉栏
      <ScrollView style={{ backgroundColor: '#098' }}>
        <SafeAreaView forceInset={{ top: 'always' }}>
          <DrawerNavigatorItems {...props} />
        </SafeAreaView>
      </ScrollView>
    ),
    contentOptions: {
      activeTintColor: '#fff',
    },
  },
);
