import ProjectModel from './ProjectModel';
import FavoriteUtil from './FavoriteUtil';

/**
 * 处理数据
 * @param type action的type
 * @param dispatch action.dispatch
 * @param storeName Label名称
 * @param data 数据源
 * @param pageSize 页面数据量
 * @param favoriteDao 收藏的DAO
 * @param params 扩展
 */
export function handleData(
  type,
  dispatch,
  storeName,
  data,
  pageSize,
  favoriteDao,
  params) {
  let fixItems = [];
  if (data && data.data) {
    // 处理popular和trending数据格式差异
    if (Array.isArray(data.data)) {
      fixItems = data && data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data && data.data.items;
    }
  }
  // 第一次要加载的数据
  let showItems = pageSize > fixItems.length
    ? fixItems
    : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type,
      items: fixItems,
      projectModels,
      storeName,
      pageIndex: 1,
      ...params,
    });
  })
}

/**
 * 通过本地的收藏状态包装item
 * @param showItems 当前页面展示的数据源
 * @param favoriteDao 收藏的DAO
 * @param callback 回调
 * @return {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    // 获取收藏的key
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e)
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(
      new ProjectModel(showItems[i], FavoriteUtil.checkFavorite(showItems[i], keys))
    )
  }
  if (typeof callback === 'function') {
    callback(projectModels);
  }
}

export const doCallback = (callback, object) => {
  if (typeof callback === 'function') {
    callback(object);
  }
}
