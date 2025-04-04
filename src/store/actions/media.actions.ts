import { Media } from '@/models/entities/Content';
import { MediaActionType } from './actions.constants';

export const uploadFileAction = (
  payload: {
    fileName: string;
    category: string;
    file: File;
  }[]
) => ({
  type: MediaActionType.UPLOAD_FILE,
  payload,
});

export const uploadFileCompletedAction = (payload: Media[]) => ({
  type: MediaActionType.UPLOAD_FILE_COMPLETED,
  payload,
});

export const uploadFileErrorAction = (payload: string) => ({
  type: MediaActionType.UPLOAD_FILE_ERROR,
  payload,
});

export const resetMediaUploadStateAction = () => ({
  type: MediaActionType.RESET_STATE,
});

export const uploadProgressAction = (fileName: string, progress: number) => ({
  type: MediaActionType.UPLOAD_PROGRESS,
  payload: { fileName, progress },
});
