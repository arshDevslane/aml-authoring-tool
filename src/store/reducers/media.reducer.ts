import produce from 'immer';
import { Media } from '@/models/entities/Content';
import { MediaActionType } from '../actions/actions.constants';

export type MediaState = {
  isLoadingSignedUrls: boolean;
  signedUrlsError?: string;
  signedUrls: Record<string, any>;
  uploadProgress: Record<string, any>;
  isUploadingFiles: boolean;
  uploadError?: string;
  uploadedMedia?: Media[];
  uploadedMediaLoading?: boolean;
};

const mediaState: MediaState = {
  isLoadingSignedUrls: false,
  signedUrls: {},
  uploadProgress: {}, // Add this
  isUploadingFiles: false,
  uploadedMediaLoading: false,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const mediaReducer = (state: MediaState = mediaState, action: any) =>
  produce(state, (draft: MediaState) => {
    switch (action.type) {
      case MediaActionType.UPLOAD_FILE:
        draft.signedUrlsError = '';
        draft.uploadError = '';
        draft.isLoadingSignedUrls = true;
        draft.uploadedMediaLoading = true;
        break;
      case MediaActionType.UPLOAD_FILE_COMPLETED:
        draft.uploadedMedia = action.payload;
        console.log(draft.uploadedMedia, 'media');
        draft.isLoadingSignedUrls = false;
        draft.isUploadingFiles = false;
        draft.uploadProgress = {};
        draft.uploadedMediaLoading = false;

        break;
      case MediaActionType.UPLOAD_FILE_ERROR:
        draft.isLoadingSignedUrls = false;
        draft.signedUrlsError = action.payload;
        draft.isUploadingFiles = false;
        draft.uploadProgress = {};
        draft.uploadError = action.payload;
        draft.uploadedMediaLoading = false;
        break;

      case MediaActionType.UPLOAD_PROGRESS: {
        draft.uploadProgress = {
          ...state.uploadProgress,
          [action.payload.fileName]: action.payload.progress,
        };
        draft.isUploadingFiles = true;
        break;
      }
      case MediaActionType.RESET_STATE: {
        draft.isLoadingSignedUrls = false;
        draft.signedUrls = {};
        draft.signedUrlsError = '';
        draft.isUploadingFiles = false;
        draft.uploadProgress = {};
        draft.uploadError = '';
        break;
      }
      default:
        break;
    }
  });
