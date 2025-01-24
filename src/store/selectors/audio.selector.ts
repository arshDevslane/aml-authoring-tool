import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { AudioState } from '../reducers/audio.reducer';

const audioState = (state: AppState) => state.audio;

export const audioListSelector = createSelector(
  [audioState],
  (state: AudioState) => state.entities
);

export const isLoadingAudioSelector = createSelector(
  [audioState],
  (state: AudioState) => state.isLoading
);

export const audioErrorSelector = createSelector(
  [audioState],
  (state: AudioState) => state.error
);
