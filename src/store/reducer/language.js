import types from '../types';
import { FLAG_LANGUAGE } from '../../utils/LanguageDao';

const defaultState = {
  languages: [],
  keys: [],
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case types.LANGUAGE_LOAD_SUCCESS:
      if (FLAG_LANGUAGE.flag_key === action.flag) {
        return {
          ...state,
          keys: action.languages,
        }
      } else {
        return {
          ...state,
          languages: action.languages,
        }
      }
    default:
      return state;
  }
}
