import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { TtsState } from '../reducers/tts.reducer';

const ttsState = (state: AppState) => state.tts;

export const ttsSelector = createSelector(
  [ttsState],
  (state: TtsState) => state.tts
);

export const isLoadingTtsSelector = createSelector(
  [ttsState],
  (state: TtsState) => state.isLoading
);

export const ttsErrorSelector = createSelector(
  [ttsState],
  (state: TtsState) => state.error
);
