import { onThemeChange } from './theme';
import { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onLoadTrendingData, onLoadMoreTrending } from './trending';
import { onLoadFavoriteData } from './favorite';

export default {
  // theme
  onThemeChange,
  // popular
  onLoadPopularData,
  onLoadMorePopular,
  onFlushPopularFavorite,
  // trending
  onLoadTrendingData,
  onLoadMoreTrending,
  // favorite
  onLoadFavoriteData,
};
