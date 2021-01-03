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
    case types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items,
          isLoading: false,
        },
      };
    case types.POPULAR_REFRESH:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOAD_POPULAR_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
