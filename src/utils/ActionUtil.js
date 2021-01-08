import ProjectModel from './ProjectModel';
import FavoriteUtil from './FavoriteUtil';

/**
 * 处理数据
 * @param type action的type
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * @param favoriteDao
 */
export function handleData(type, dispatch, storeName, data, pageSize, favoriteDao) {
  let fixItems = [];
  if (data && data.data) {
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
    });
  })
}

/**
 * 通过本地的收藏状态包装item
 * @param showItems
 * @param favoriteDao
 * @param callback
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
