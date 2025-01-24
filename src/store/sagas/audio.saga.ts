import { SagaPayloadType } from '@/types/SagaPayload.type';
import { call, put, takeLatest } from 'redux-saga/effects';
import { speechAndTranslateService } from '@/services/api-services/SpeechAndTranslateService';
import { AudioActionType } from '../actions/actions.constants';
import {
  getAudioListCompletedAction,
  getAudioListErrorAction,
} from '../actions/audio.action';

interface AudioSagaPayloadType extends SagaPayloadType {
  payload: { questionId: string };
}

function* getAudioList({ payload }: AudioSagaPayloadType): any {
  try {
    const response = yield call(
      speechAndTranslateService.getAudioList,
      payload.questionId
    );
    yield put(getAudioListCompletedAction(response.result));
  } catch (e: any) {
    yield put(
      getAudioListErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

export function* audioSaga() {
  yield takeLatest(AudioActionType.GET_AUDIO, getAudioList);
}
