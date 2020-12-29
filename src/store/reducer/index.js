import { combineReducers } from 'redux';
import theme from './theme';

const reducer = combineReducers({
  theme: theme,
});

export default reducer
