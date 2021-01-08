import  types from '../types';
import DataStore, { FLAG_STORE } from '../../utils/DataStoreUtil';
import { handleData } from '../../utils/ActionUtil';

/**
 * 获取trending数据的action
 * @param storeName
 * @param url
 * @param pageSize
 * @return {function(...[*]=)}
 */
export function onLoadTrendingData (storeName, url, pageSize) {
  return dispatch => {
    dispatch({ type: types.TRENDING_REFRESH, storeName });
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORE.flag_trending)
      .then(data => {
        handleData(types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize);
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: types.TRENDING_REFRESH_FAIL, storeName, error });
      });
  };
}

/**
 * 获取分页数据
 * @param storeName keyLabel
 * @param pageIndex 页码
 * @param pageSize 每页展示数据量
 * @param dataArray 数据源
 * @param callback  回调
 * @return {function(...[*]=)}
 */
export function onLoadMoreTrending(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModels: dataArray,
        })
      } else {
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length
          ? dataArray.length
          : pageSize * pageIndex;
        dispatch({
          type: types.TRENDING_REFRESH_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max),
        })
      }
    }, 500)
  }
}
