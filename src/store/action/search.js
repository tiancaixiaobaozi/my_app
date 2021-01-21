import  types from '../types';
import { _projectModels, handleData, doCallback } from '../../utils/ActionUtil';
import ArrayUtil from '../../utils/ArrayUtil';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

/**
 * 搜索
 * @param inputKey
 * @param pageSize
 * @param token
 * @param favoriteDao
 * @param popularKeys
 * @param callback
 * @return {function(...[*]=)}
 */
export function onSearch (
  inputKey,
  pageSize,
  token,
  favoriteDao,
  popularKeys,
  callback) {
  return dispatch => {
    dispatch({ type: types.SEARCH_REFRESH });
    fetch(genFetchUrl(inputKey))
      .then(response => {
        // 如果任务取消，则不做处理
        return hasCancel(token) ? null : response.json();
      })
      .then(responseData => {
        if (hasCancel(token, true)) {
          console.log('user cancel!');
          return;
        }
        if (!responseData || !responseData.items || responseData.items.length === 0) {
          dispatch({
            type: types.SEARCH_FAIL,
            message: `没有找到${inputKey}相关的项目`
          });
          doCallback(callback, `没有找到${inputKey}相关的项目`);
          return;
        }
        let items = responseData.items;
        handleData(
          types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          null,
          { data: items },
          pageSize,
          favoriteDao,
          {
            showBottomButton: !ArrayUtil.checkKeyIsExist(popularKeys, inputKey),
            inputKey,
          });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: types.SEARCH_FAIL,
          error,
        });
      });
  };
}

/**
 * 取消搜索
 * @param token
 */
export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({ type: types.SEARCH_CANCEL });
  }
}

/**
 * 获取分页数据
 * @param pageIndex 页码
 * @param pageSize 每页展示数据量
 * @param dataArray 数据源
 * @param favoriteDao
 * @param callback  回调
 * @return {function(...[*]=)}
 */
export function onLoadMoreSearch(
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
          type: types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex,
        });
      } else {
        // 本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length
          ? dataArray.length
          : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels,
          });
        });
      }
    }, 3000);
  };
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}

/**
 * 判断指定token是否已取消
 * @param token
 * @param isRemove
 * @return {boolean}
 */
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}
