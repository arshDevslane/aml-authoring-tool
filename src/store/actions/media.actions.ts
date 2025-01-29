import { MediaActionType } from './actions.constants';

export const getPresignedUrlAction = (
  payload: {
    fileName: string;
    category: string;
  }[]
) => ({
  type: MediaActionType.GET_PRESIGNED_URL,
  payload,
});

export const getPresignedUrlCompletedAction = (payload: any) => ({
  type: MediaActionType.GET_PRESIGNED_URL_COMPLETED,
  payload,
});

export const uploadAction = (payload: { signedUrl: string; file: File }[]) => ({
  type: MediaActionType.UPLOAD,
  payload,
});

export const uploadCompletedAction = (payload: any) => ({
  type: MediaActionType.UPLOAD_COMPLETED,
  payload,
});

export const uploadErrorAction = (payload: string) => ({
  type: MediaActionType.UPLOAD_ERROR,
  payload,
});

export const getPresignedUrlErrorAction = (payload: string) => ({
  type: MediaActionType.GET_PRESIGNED_URL_ERROR,
  payload,
});

export const resetMediaUploadStateAction = () => ({
  type: MediaActionType.RESET_STATE,
});

export const uploadProgressAction = (fileName: string, progress: number) => ({
  type: MediaActionType.UPLOAD_PROGRESS,
  payload: { fileName, progress },
});
