import { TranslationActionType } from './actions.constants';

export type TranslationPayload = {
  input_string: string;
  target_language: string;
};

export const getTranslationAction = (payload: TranslationPayload) => ({
  type: TranslationActionType.GET_TRANSLATIONS,
  payload,
});

export const getTranslationCompletedAction = (payload: any) => ({
  type: TranslationActionType.GET_TRANSLATIONS_COMPLETED,
  payload,
});

export const getTranslationErrorAction = (payload: TranslationPayload) => ({
  type: TranslationActionType.GET_TRANSLATIONS_ERROR,
  payload,
});

export const resetTranslationStateAction = () => ({
  type: TranslationActionType.RESET_STATE,
});

export const removeTranslationAction = (lang: string) => ({
  type: TranslationActionType.REMOVE_TRANSLATION,
  payload: lang,
});
