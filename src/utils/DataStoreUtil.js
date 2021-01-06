import { AsyncStorage } from 'react-native';
import GitHubTrending from 'GitHubTrending';
export const FLAG_STORE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};
const GITHUB_TOKEN = 'fd82d1e882462e23b8e88aa82198f166';

export default class DataStore {
  /**
   * 获取数据
   * @param url
   * @param flag tab模块名
   * @return {Promise<R>}
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then(wrapData => {
          if (wrapData && this.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then(data => {
                resolve(this._wrapData(data));
              })
              .catch(error => {
                reject(error);
              })
          }
        })
        .catch(error => {
          this.fetchNetData(url, flag)
            .then(data => {
              resolve(this._wrapData(data));
            })
            .catch(error => {
              reject(error);
            })
        })
    })
  }

  /**
   * 保存本地数据
   * @param url
   * @param data
   * @param callback
   */
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
  }

  /**
   * 获取本地存储数据
   * @param url
   * @return {Promise<R>}
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      })
    })
  }

  /**
   * 获取网络数据
   * @param url
   * @param flag
   * @return {Promise<R>}
   */
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORE.flag_trending) {
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok!');
          })
          .then(responseData => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch(error => {
            reject(error);
          })
      } else {
        new GitHubTrending(GITHUB_TOKEN).fetchTrending(url)
          .then(items => {
            if (!items) {
              throw new Error('response is null')
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch(e => {
            reject(e)
          })
      }
    })
  }

  /**
   * 格式化数据
   * @param data
   * @return {{data: *, timestamp: number}}
   * @private
   */
  _wrapData(data) {
    return {
      data,
      timestamp: new Date().getTime(),
    }
  }

  /**
   * 检查timestamp是否在有效期内
   * @param timestamp
   * @return {boolean}
   */
  checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }
}
