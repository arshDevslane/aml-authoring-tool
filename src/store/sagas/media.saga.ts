import { mediaService } from '@/services/api-services/MediaService';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, delay, put, take, takeLatest } from 'redux-saga/effects';
import { uploadService } from '@/services/api-services/UploadService';
import { toastService } from '@/services/ToastService';
import { END, eventChannel } from 'redux-saga';
import {
  getPresignedUrlCompletedAction,
  getPresignedUrlErrorAction,
  uploadCompletedAction,
  uploadErrorAction,
  uploadProgressAction,
} from '../actions/media.actions';
import { MediaActionType } from '../actions/actions.constants';

interface MediaSagaPayloadType extends SagaPayloadType {
  payload: {
    fileName: string;
    category: string;
  }[];
}

function* getPresignedUrlSaga(data: MediaSagaPayloadType): any {
  try {
    const response = yield call(mediaService.getPresignedUrls, data.payload);
    yield put(getPresignedUrlCompletedAction(response.result));
  } catch (e: any) {
    yield put(
      getPresignedUrlErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* uploadSingleMediaSaga(data: any): any {
  const { file, signedUrl } = data.payload;
  let emit: any;

  // Create an event channel for progress updates
  const progressChannel = eventChannel((emitter) => {
    emit = emitter;
    return () => {}; // No cleanup needed
  });

  // Define the onUploadProgress callback
  const onUploadProgress = (progressEvent: ProgressEvent) => {
    const progress = Math.floor(
      (progressEvent.loaded / progressEvent.total) * 100
    );
    emit(progress); // Emit progress to the channel
    if (progress === 100) {
      emit(END); // Close the channel when upload is complete
    }
  };

  try {
    // Start the upload
    // eslint-disable-next-line
    const uploadPromise = uploadService.uploadFile({
      signedUrl,
      file,
      onUploadProgress,
    });

    // Listen for progress updates from the channel
    while (true) {
      const progress = yield take(progressChannel);

      if (progress < 100) {
        // Dispatch progress update
        yield put(uploadProgressAction(file.name, progress));
      } else {
        // Upload complete
        yield delay(1000); // Optional delay to simulate final processing
        yield put(uploadProgressAction(file.name, progress));
        yield put(uploadCompletedAction(file));
      }
    }
  } catch (e: any) {
    yield put(
      uploadErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  } finally {
    progressChannel.close(); // Close the channel
  }
}

function* uploadContentSaga(data: any): any {
  const uploadData = data.payload;
  try {
    for (let i = 0; i < uploadData.length; i += 1) {
      const { file, signedUrl } = uploadData[i];

      yield call(uploadSingleMediaSaga, {
        payload: { file, signedUrl },
      });
    }
  } catch (e: any) {
    yield put(
      uploadErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
    toastService.showError('Unable to upload files, please try again');
  }
}

export function* mediaSaga() {
  yield all([
    takeLatest(MediaActionType.GET_PRESIGNED_URL, getPresignedUrlSaga),
    takeLatest(MediaActionType.UPLOAD, uploadContentSaga),
  ]);
}
