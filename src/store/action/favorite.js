import  types from '../types';
import FavoriteDao from '../../utils/FavoriteDao';
import ProjectModel from '../../utils/ProjectModel';

/**
 * 加载收藏的项目
 * @param flag
 * @param isShowLoading
 * @returns {function(...[*]=)}
 */
export function onLoadFavoriteData (flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({ type: types.FAVORITE_LOAD_DATA, storeName: flag });
    }
    new FavoriteDao(flag).getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        });
      })
      .catch(error => {
        dispatch({
          type: types.FAVORITE_LOAD_FAIL,
          error,
          storeName: flag,
        });
      });
  };
}
