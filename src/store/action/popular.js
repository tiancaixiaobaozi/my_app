import  types from '../types';
import DataStore from '../../utils/DataStoreUtil';

export function onLoadPopularData (storeName, url) {
  return dispatch => {
    dispatch({ type: types.POPULAR_REFRESH, storeName });
    let dataStore = new DataStore();
    dataStore.fetchData(url)
      .then(data => {
        handleData(dispatch, storeName, data);
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: types.LOAD_POPULAR_FAIL, storeName, error });
      });
  };
}

function handleData(dispatch, storeName, data) {
  dispatch({
    type: types.LOAD_POPULAR_SUCCESS,
    items: data && data.data && data.data.items,
    storeName,
  });
}
