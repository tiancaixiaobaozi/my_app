import types from '../types';

const defaultState = {};

/**
 * state数据树
 * popular: {
 *   java: {
 *     items: [],
 *     isLoading: false,
 *   },
 *   ios: {
 *     items: [],
 *     isLoading: false,
 *   },
 *   ...
 * }
 * @param state
 * @param action
 * @returns {{}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case types.POPULAR_REFRESH_SUCCESS:
      // 下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,  // 原始数据
          projectModels: action.projectModels,  // 本次展示的数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case types.POPULAR_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        },
      };
    case types.POPULAR_REFRESH_FAIL:
      // 下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    case types.POPULAR_LOAD_MORE_SUCCESS:
      // 下拉加载更多成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        }
      };
    case types.POPULAR_LOAD_MORE_FAIL:
      // 下拉加载更多失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        }
      };
    default:
      return state;
  }
}
