import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk';
import reducer from './reducer';

/**
 * 自定义中间件
 * @param store
 * @return {function(*): function(...[*]=)}
 */
const logger = store => next => action => {
  if (typeof action === 'function') {
    console.log('dispatch a function');
  } else {
    console.log('dispatch action:::', action);
  }
  const result = next(action);
  console.log('nextState:::', store.getState());
  return result;
}

const middleware = [
  logger,
  thunk
];

export default createStore(reducer, applyMiddleware(...middleware));
