import { createSelector } from 'reselect';
import { AppState } from '../reducers';

const translationState = (state: AppState) => state.translation;

export const translationSelector = createSelector(
  [translationState],
  (translation) => translation.translations
);

export const translationErrorSelector = createSelector(
  [translationState],
  (translation) => translation.error
);

export const isLoadingTranslationsSelector = createSelector(
  [translationState],
  (translation) => translation.isLoading
);
