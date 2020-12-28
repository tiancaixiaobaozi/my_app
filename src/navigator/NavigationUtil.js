
export default class NavigationUtil {
  /**
   * 重置到首页
   * @param params
   */
  static resetToHomePage(params) {
    const { navigation }  = params;
    navigation.navigate('Main');
  }

  /**
   * 跳转到指定页面
   * @param route 路由名
   * @param params 传递的参数
   */
  static goPage(route, params) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation不能为空！');
    }
    navigation.navigate(route, {...params});
  }
}
