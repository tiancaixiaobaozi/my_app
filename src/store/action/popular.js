import  types from '../types';
import DataStore, { FLAG_STORE } from '../../utils/DataStoreUtil';
import { _projectModels, handleData } from '../../utils/ActionUtil';

/**
 * 获取popular数据的action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @return {function(...[*]=)}
 */
export function onLoadPopularData (storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({ type: types.POPULAR_REFRESH, storeName });
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORE.flag_popular)
      .then(data => {
        handleData(
          types.POPULAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: types.POPULAR_REFRESH_FAIL, storeName, error });
      });
  };
}

/**
 * 获取分页数据
 * @param storeName keyLabel
 * @param pageIndex 页码
 * @param pageSize 每页展示数据量
 * @param dataArray 数据源
 * @param favoriteDao
 * @param callback  回调
 * @return {function(...[*]=)}
 */
export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callback) {
  return dispatch => {
    // 模拟网络请求
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more');
        }
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
        });
      } else {
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length
          ? dataArray.length
          : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels,
          });
        });
      }
    }, 3000);
  };
}

/**
 * 刷新热门页面的数据的收藏状态
 * @param storeName label
 * @param pageIndex 页码
 * @param pageSize  条数
 * @param dataArray 数据源
 * @param favoriteDao
 */
export function onFlushPopularFavorite(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao) {
  return dispatch => {
    let max = pageSize * pageIndex > dataArray.length
      ? dataArray.length
      : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
      dispatch({
        type: types.FLUSH_POPULAR_FAVORITE,
        storeName,
        pageIndex,
        projectModels,
      });
    });
  };
}
