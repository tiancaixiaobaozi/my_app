import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';

const reducer = combineReducers({
  // theme
  theme,
  // popular
  popular,
});

export default reducer;
