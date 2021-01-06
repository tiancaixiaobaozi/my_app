/**
 * 处理数据
 * @param type action的type
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 */
export function handleData(type, dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data && data.data;
    } else if (Array.isArray(data.data.items)) {
      fixItems = data && data.data.items;
    }
  }
  dispatch({
    type,
    items: fixItems,
    projectModes: pageSize > fixItems.length
      ? fixItems
      : fixItems.slice(0, pageSize),
    storeName,
    pageIndex: 1,
  });
}
