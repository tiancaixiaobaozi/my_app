/**
 * 带收藏状态的item
 * @param item 数据item
 * @param isFavorite 是否收藏
 * @constructor
 */
export default function ProjectModel(item, isFavorite) {
  this.item = item;
  this.isFavorite = isFavorite;
}

