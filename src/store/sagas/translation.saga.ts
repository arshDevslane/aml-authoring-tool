import { SagaPayloadType } from '@/types/SagaPayload.type';
import { call, put, takeLatest } from 'redux-saga/effects';
import { speechAndTranslateService } from '@/services/api-services/SpeechAndTranslateService';
import {
  getTranslationCompletedAction,
  getTranslationErrorAction,
  TranslationPayload,
} from '../actions/translation.action';
import { TranslationActionType } from '../actions/actions.constants';

interface TranslationSagaPayloadType extends SagaPayloadType {
  payload: TranslationPayload;
}

function* getTranslationForTextSaga({
  payload,
}: TranslationSagaPayloadType): any {
  try {
    const { input_string: inputString, target_language: lang } = payload;
    const response = yield call(
      speechAndTranslateService.getTranslatedText,
      inputString,
      lang
    );
    yield put(
      getTranslationCompletedAction({
        [lang]: response.result.output[0].target ?? '',
      })
    );
  } catch (e: any) {
    yield put(
      getTranslationErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* translationSaga() {
  yield takeLatest(
    TranslationActionType.GET_TRANSLATIONS,
    getTranslationForTextSaga
  );
}

export default translationSaga;
