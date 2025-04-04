import { mediaService } from '@/services/api-services/MediaService';
import { all, call, put, takeLatest, take } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import { toastService } from '@/services/ToastService';
import {
  uploadFileCompletedAction,
  uploadFileErrorAction,
  uploadProgressAction,
} from '../actions/media.actions';
import { MediaActionType } from '../actions/actions.constants';

type FileUploadData = { fileName: string; category: string; file: File };

function createUploadProgressChannel(files: FileUploadData[]) {
  return eventChannel((emit) => {
    let lastProgress = 0;
    const onUploadProgress = (progressEvent: ProgressEvent) => {
      if (progressEvent.total > 0) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (percentCompleted > lastProgress) {
          lastProgress = percentCompleted;
          files.forEach((file) => {
            emit(uploadProgressAction(file?.fileName, percentCompleted));
          });
        }
      }
    };

    mediaService
      .uploadFile(files, onUploadProgress)
      .then((response) => {
        emit(uploadFileCompletedAction(response?.result?.files));
        emit(END);
      })
      .catch((e) => {
        console.error('Upload error:', e);
        emit(uploadFileErrorAction(e?.errors?.[0]?.message || e?.message));
        toastService.showError('Upload failed, please try again');
        emit(END);
      });

    return () => {};
  });
}

function* uploadFileMediaSaga(action: any): Generator {
  const files = Array.isArray(action.payload)
    ? action.payload
    : [action.payload];
  const channel = yield call(createUploadProgressChannel, files);

  try {
    while (true) {
      const progressAction = yield take(channel);
      yield put(progressAction);
    }
  } finally {
    channel.close();
  }
}

export function* mediaSaga() {
  yield all([takeLatest(MediaActionType.UPLOAD_FILE, uploadFileMediaSaga)]);
}
