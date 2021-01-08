import { FLAG_STORE } from './DataStoreUtil';

export default class FavoriteUtil {
  /**
   * 检查该item是否被收藏
   * @param item
   * @param keys
   * @return {boolean}
   */
  static checkFavorite(item, keys = []) {
    if (!keys) return false;
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = item.id ? item.id : item.fullName;
      if (id.toString() === keys[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * 点击favoriteIcon回调函数
   * @param favoriteDao 收藏的DAO
   * @param item 数据item
   * @param isFavorite 是否收藏
   * @param flag enum[popular/trending]
   */
  static onFavorite(favoriteDao, item, isFavorite, flag) {
    const key = flag === FLAG_STORE.flag_trending
      ? item.fullName
      : item.id.toString();
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }
}
