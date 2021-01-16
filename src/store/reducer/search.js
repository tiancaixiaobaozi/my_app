import types from '../types';

const defaultState = {
  showText: '搜索',
  items: [],
  isLoading: false,
  projectModels: [],
  hideLoadingMore: true,
  showBottomButton: false,
};

/**
 * state数据树
 * @param state
 * @param action
 * @returns {{}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case types.SEARCH_REFRESH:
      // 下拉刷新
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false,
      };
    case types.SEARCH_REFRESH_SUCCESS:
      // 下拉刷新成功
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: true,
        showBottomButton: action.showBottomButton,
        items: action.items,
        projectModels: action.projectModels,
        pageIndex: action.pageIndex,
        showText: '搜索',
        inputKey: action.inputKey,
      };
    case types.SEARCH_FAIL:
      // 下拉刷新失败
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case types.SEARCH_CANCEL:
      // 取消搜索
      return  {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case types.SEARCH_LOAD_MORE_SUCCESS:
      return {
        ...state,
        projectModels: action.projectModels,
        hideLoadingMore: false,
        pageIndex: action.pageIndex,
      };
    case types.SEARCH_LOAD_MORE_FAIL:
      return {
        ...state,
        hideLoadingMore: true,
        pageIndex: action.pageIndex,
      };
    default:
      return state;
  }
}
