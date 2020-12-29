import types from '../types';

const defaultState = {
  color: 'blue',
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case types.THEME_CHANGE:
      return {
        ...state,
        color: action.theme,
      };
    default:
      return state;
  }
}
