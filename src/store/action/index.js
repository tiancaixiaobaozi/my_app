import { onThemeChange } from './theme';
import { onLoadPopularData, onLoadMorePopular } from './popular';
import { onLoadTrendingData, onLoadMoreTrending } from './trending';
import { onLoadFavoriteData } from './favorit';

export default {
  // theme
  onThemeChange,
  // popular
  onLoadPopularData,
  onLoadMorePopular,
  // trending
  onLoadTrendingData,
  onLoadMoreTrending,
  // favorite
  onLoadFavoriteData,
};
