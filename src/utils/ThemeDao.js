import { AsyncStorage } from 'react-native';
import ThemeFactory, { ThemeFlags } from '../res/style/ThemeFactory';

const THEME_KEY = 'THEME_KEY';

export default class ThemeDao {

  /**
   * 获取当前主题
   * @return {Promise<R>}
   */
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          this.save(ThemeFlags.Default);
          result = ThemeFlags.Default;
        }
        resolve(ThemeFactory.createTheme(result));
      });
    });
  }

  /**
   * 保存主题
   * @param themeFlag
   */
  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, error => {});
  }
}
