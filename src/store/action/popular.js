import  types from '../types';
import DataStore from '../../utils/DataStoreUtil';

/**
 * 获取popular数据的action
 * @param storeName
 * @param url
 * @param pageSize
 * @return {function(...[*]=)}
 */
export function onLoadPopularData (storeName, url, pageSize) {
  return dispatch => {
    dispatch({ type: types.POPULAR_REFRESH, storeName });
    let dataStore = new DataStore();
    dataStore.fetchData(url)
      .then(data => {
        handleData(dispatch, storeName, data, pageSize);
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
 * @param callback  回调
 * @return {function(...[*]=)}
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callback) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callback === 'function') {
          callback('no more')
        }
        dispatch({
          type: types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray,
        })
      } else {
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length
          ? dataArray.length
          : pageSize * pageIndex;
        dispatch({
          type: types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModes: dataArray.slice(0, max),
        })
      }
    }, 500)
  }
}

/**
 * 处理数据
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data && data.data.items) {
    fixItems = data && data.data.items;
  }
  dispatch({
    type: types.POPULAR_REFRESH_SUCCESS,
    items: fixItems,
    projectModes: pageSize > fixItems.length
      ? fixItems
      : fixItems.slice(0, pageSize),
    storeName,
    pageIndex: 1,
  });
}
