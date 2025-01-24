import { SagaPayloadType } from '@/types/SagaPayload.type';
import { call, put, takeLatest } from 'redux-saga/effects';
import { speechAndTranslateService } from '@/services/api-services/SpeechAndTranslateService';
import {
  getTtsCompletedAction,
  TtsActionPayloadType,
} from '../actions/tts.action';
import { TtsActionType } from '../actions/actions.constants';
import { getAudioListCompletedAction } from '../actions/audio.action';

interface TTSSagaPayloadType extends SagaPayloadType {
  payload: TtsActionPayloadType;
}

function* getTtsSaga({ payload }: TTSSagaPayloadType): any {
  try {
    const response = yield call(
      speechAndTranslateService.getSpeechSynthesis,
      payload
    );
    yield put(getTtsCompletedAction(response.result));
    yield put(getAudioListCompletedAction([response.result]));
  } catch (e: any) {
    yield put(
      getTtsCompletedAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

export function* ttsSaga() {
  yield takeLatest(TtsActionType.GET_TTS, getTtsSaga);
}
