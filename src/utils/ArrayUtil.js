export default class ArrayUtil {
  /**
   * 判断两个数组是否相等
   * @param arr1
   * @param arr2
   * @return {boolean}
   */
  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    for (let i = 0, len = arr1.length; i < len; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  /**
   * 更新数组，若item存在于array，则从array则移除，否则添加至array
   * @param array
   * @param item
   */
  static updateArray(array, item) {
    for (let i = 0, len = array.length; i < len; i++) {
      let temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  }

  /**
   * 若item已经存在于数组，则将其移除
   * @param array
   * @param item 移除的目标
   * @param id 两者对比的属性
   */
  static remove(array, item, id) {
    if (!array) return;
    for (let i = 0, l = array.length; i < l; i++) {
      const val = array[i];
      if (item === val || val && val[id] && val[id] === item[id]) {
        array.splice(i, 1);
      }
    }
    return array;
  }
}
