import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { MediaState } from '../reducers/media.reducer';

const mediaState = (state: AppState) => state.media;

export const presignedUrlsSelector = createSelector(
  [mediaState],
  (state: MediaState) => state.signedUrls
);

export const isLoadingPresignedUrlsSelector = createSelector(
  [mediaState],
  (state: MediaState) => state.isLoadingSignedUrls
);

export const isUploadInProgressSelector = createSelector(
  [mediaState],
  (state: MediaState) => state.isUploadingFiles
);

export const uploadErrorSelector = createSelector(
  [mediaState],
  (state: MediaState) => state.uploadError
);

export const uploadProgressSelector = createSelector(
  [mediaState],
  (state: MediaState) => state.uploadProgress
);
