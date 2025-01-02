import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PaginationLimit } from '@/enums/tableEnums';
import { questionsService } from '@/services/api-services/QuestionsService';
import {
  getListQuestionsCompletedAction,
  getListQuestionsErrorAction,
  QuestionsActionPayloadType,
} from '../actions/question.action';
import { QuestionsActionType } from '../actions/actions.constants';

interface QuestionsSagaPayloadType extends SagaPayloadType {
  payload: QuestionsActionPayloadType;
}
function* getListQuestionsSaga(data: QuestionsSagaPayloadType): any {
  try {
    const { page_no: pageNo, ...filters } = data.payload.filters;

    const response: Awaited<ReturnType<typeof questionsService.getList>> =
      yield call(questionsService.getList, {
        filters,
        limit: PaginationLimit.PAGE_SIZE,
        // offset: 0,
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
function* questionsSaga() {
  yield all([takeLatest(QuestionsActionType.GET_LIST, getListQuestionsSaga)]);
}
export default questionsSaga;
