import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme';
import { onLoadPopularData, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';

export default {
  // theme
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  // popular
  onLoadPopularData,
  onLoadMorePopular,
  onFlushPopularFavorite,
  // trending
  onLoadTrendingData,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  // favorite
  onLoadFavoriteData,
  // language
  onLoadLanguage,
};
