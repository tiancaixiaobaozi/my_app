import LanguageDao from '../../utils/LanguageDao';
import types from '../types';

/**
 *
 * @param flagKey
 * @return {function(...[*]=)}
 */
export function onLoadLanguage(flagKey) {
 return async dispatch => {
   try {
     let languages = await new LanguageDao(flagKey).fetch();
     dispatch({
       type: types.LANGUAGE_LOAD_SUCCESS,
       languages,
       flag: flagKey,
     });
   } catch (e) {
     console.log(e);
   }
 }
}
