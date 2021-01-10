import types from '../types';

const defaultState = {};

/**
 * state数据树
 * favorite: {
 *   popular: {
 *     projectModels: [],
 *     isLoading: false,
 *   },
 *   trending: {
 *     projectModels: [],
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
    case types.FAVORITE_LOAD_DATA:
      // 获取数据
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        },
      };
    case types.FAVORITE_LOAD_SUCCESS:
      // 下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          isLoading: false,
        },
      };
    case types.FAVORITE_LOAD_FAIL:
      // 下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    default:
      return state;
  }
}
