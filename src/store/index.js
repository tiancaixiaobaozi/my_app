import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

/**
 * 自定义中间件logger
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
};

const middleware = [
  logger,
  thunk,
];

/**
 * 数据流向
 * 1.页面发起action
 * 2.action -> reducer
 * 3.reducer -> state
 * 4.state -> 页面
 */
export default createStore(reducer, applyMiddleware(...middleware));
