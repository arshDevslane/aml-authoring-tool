import produce from 'immer';
import { TranslationActionType } from '../actions/actions.constants';

export type TranslationState = {
  isLoading: boolean;
  translations: Record<string, string>;
  error?: string;
};

const initialState: TranslationState = {
  translations: {},
  isLoading: false,
};

export const translationReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: TranslationState = initialState,
  action: any
) =>
  produce(state, (draft: TranslationState) => {
    switch (action.type) {
      case TranslationActionType.GET_TRANSLATIONS:
        draft.isLoading = true;
        break;
      case TranslationActionType.GET_TRANSLATIONS_COMPLETED:
        draft.isLoading = false;
        draft.translations = {
          ...state.translations,
          ...action.payload,
        };
        break;
      case TranslationActionType.GET_TRANSLATIONS_ERROR:
        draft.isLoading = false;
        draft.error = action.payload.error;
        break;
      case TranslationActionType.RESET_STATE:
        draft.isLoading = false;
        draft.translations = {};
        draft.error = '';
        break;
      case TranslationActionType.REMOVE_TRANSLATION:
        delete draft.translations[action.payload];
        break;
      default:
        break;
    }
  });
