import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { PaginationLimit } from '@/enums/tableEnums';
import { questionsService } from '@/services/api-services/QuestionsService';
import { toastService } from '@/services/ToastService';
import {
  deleteQuestionCompletedAction,
  getListQuestionsAction,
  getListQuestionsCompletedAction,
  getListQuestionsErrorAction,
  QuestionsActionPayloadType,
} from '../actions/question.action';
import { QuestionsActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';

interface QuestionsSagaPayloadType extends SagaPayloadType {
  payload: QuestionsActionPayloadType;
}
interface DeleteQuestionSagaPayloadType extends SagaPayloadType {
  payload: { questionId: string };
}
function* getListQuestionsSaga(data: QuestionsSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['questions']['cachedData'][string] =
      yield select(
        (state: AppState) =>
          state.questions.cachedData[JSON.stringify(data.payload.filters)]
      );

    if (cachedData?.result) {
      const entities: AppState['questions']['entities'] = yield select(
        (state: AppState) => state.questions.entities
      );

      yield put(
        getListQuestionsCompletedAction({
          questions: cachedData.result
            .map((id) => entities[id])
            .filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof questionsService.getList>> =
      yield call(questionsService.getList, {
        filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListQuestionsCompletedAction({
        questions: response.result.questions,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListQuestionsErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* deleteQuestionSaga(data: DeleteQuestionSagaPayloadType): any {
  const { questionId } = data.payload;
  try {
    const filters: QuestionsActionPayloadType['filters'] = yield select(
      (state: AppState) => state.questions.filters
    );

    yield call(questionsService.delete, questionId);
    yield put(deleteQuestionCompletedAction());
    toastService.showSuccess('Question deleted successfully');
    yield put(
      getListQuestionsAction({
        filters,
      })
    );
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* questionsSaga() {
  yield all([
    takeLatest(QuestionsActionType.GET_LIST, getListQuestionsSaga),
    takeLatest(QuestionsActionType.DELETE_QUESTION, deleteQuestionSaga),
  ]);
}
export default questionsSaga;
