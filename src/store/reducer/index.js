import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';

const reducer = combineReducers({
  // theme
  theme,
  // popular
  popular,
  // trending
  trending,
});

export default reducer;
