import produce from 'immer';
import { MediaActionType } from '../actions/actions.constants';

export type MediaState = {
  isLoadingSignedUrls: boolean;
  signedUrlsError?: string;
  signedUrls: Record<string, any>;

  isUploadingFiles: boolean;
  uploadError?: string;
};

const mediaState: MediaState = {
  isLoadingSignedUrls: false,
  signedUrls: {},

  isUploadingFiles: false,
};

// eslint-disable-next-line @typescript-eslint/default-param-last
export const mediaReducer = (state: MediaState = mediaState, action: any) =>
  produce(state, (draft: MediaState) => {
    switch (action.type) {
      case MediaActionType.GET_PRESIGNED_URL:
        draft.signedUrlsError = '';
        draft.uploadError = '';
        draft.isLoadingSignedUrls = true;
        break;
      case MediaActionType.GET_PRESIGNED_URL_COMPLETED:
        draft.isLoadingSignedUrls = false;
        draft.signedUrls = action.payload.signedUrls.reduce(
          (acc: any, currData: any) => {
            acc[currData.media.fileName] = currData;
            return acc;
          },
          {} as Record<string, any>
        );
        break;
      case MediaActionType.GET_PRESIGNED_URL_ERROR:
        draft.isLoadingSignedUrls = false;
        draft.signedUrlsError = action.payload;
        break;

      case MediaActionType.UPLOAD:
        draft.isUploadingFiles = true;
        break;
      case MediaActionType.UPLOAD_COMPLETED:
        draft.isUploadingFiles = false;
        break;
      case MediaActionType.UPLOAD_ERROR:
        draft.isUploadingFiles = false;
        draft.uploadError = action.payload;
        break;

      case MediaActionType.RESET_STATE:
        draft.isLoadingSignedUrls = false;
        draft.signedUrls = {};
        draft.signedUrlsError = '';
        draft.isUploadingFiles = false;
        draft.uploadError = '';
        break;
      default:
        break;
    }
  });
