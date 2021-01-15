import types from '../types';
import ThemeFactory, { ThemeFlags } from '../../res/style/ThemeFactory';

const defaultState = {
  color: ThemeFactory.createTheme(ThemeFlags.Default),
  onShowCustomThemeView: false,
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case types.THEME_CHANGE:
      return {
        ...state,
        color: action.theme,
      };
    case types.SHOW_THEME_VIEW:
      return {
        ...state,
        onShowCustomThemeView: action.customThemeViewVisible,
      };
    default:
      return state;
  }
}
