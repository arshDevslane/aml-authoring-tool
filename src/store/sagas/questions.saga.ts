import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { PaginationLimit } from '@/enums/tableEnums';
import { questionsService } from '@/services/api-services/QuestionsService';
import { toastService } from '@/services/ToastService';
import {
  createQuestionCompletedAction,
  createQuestionErrorAction,
  deleteQuestionCompletedAction,
  deleteQuestionErrorAction,
  getListQuestionsAction,
  getListQuestionsCompletedAction,
  getListQuestionsErrorAction,
  getQuestionCompletedAction,
  getQuestionErrorAction,
  publishQuestionCompletedAction,
  publishQuestionErrorAction,
  QuestionsActionPayloadType,
  updateQuestionCompletedAction,
  updateQuestionErrorAction,
} from '../actions/question.action';
import { QuestionsActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';
import { navigateTo } from '../actions/navigation.action';

interface QuestionsSagaPayloadType extends SagaPayloadType {
  payload: QuestionsActionPayloadType;
}
interface DeleteQuestionSagaPayloadType extends SagaPayloadType {
  payload: { questionId: string };
}
function* getListQuestionsSaga(data: QuestionsSagaPayloadType): any {
  try {
    const {
      page_no: pageNo = 1,
      sortOrder,
      orderBy,
      ...filters
    } = data.payload.filters;
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
          users: cachedData.users,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof questionsService.getList>> =
      yield call(questionsService.getList, {
        filters,
        ...(orderBy && sortOrder && { sort_by: [[orderBy, sortOrder]] }),
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListQuestionsCompletedAction({
        questions: response.result.questions,
        totalCount: response.result.meta.total,
        users: response.result.users,
      })
    );
  } catch (e: any) {
    yield put(
      getListQuestionsErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
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
    yield put(
      deleteQuestionErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* getQuestionSaga(data: any): any {
  try {
    const { id } = data.payload;
    const response: Awaited<ReturnType<typeof questionsService.getById>> =
      yield call(questionsService.getById, id);
    yield put(
      getQuestionCompletedAction({
        question: response.result.question,
      })
    );
  } catch (e: any) {
    yield put(
      getQuestionErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* createQuestionSaga(data: any): any {
  try {
    const { question } = data;
    const response: Awaited<
      ReturnType<typeof questionsService.createQuestion>
    > = yield call(questionsService.createQuestion, question);
    yield put(
      createQuestionCompletedAction({
        question: response.result,
      })
    );
    toastService.showSuccess('Question created successfully');
    yield put(navigateTo('/app/questions'));
  } catch (e: any) {
    yield put(
      createQuestionErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* updateQuestionSaga(data: any): any {
  try {
    const { question, id } = data.payload;

    const response: Awaited<
      ReturnType<typeof questionsService.updateQuestion>
    > = yield call(questionsService.updateQuestion, { question, id });
    yield put(
      updateQuestionCompletedAction({
        question: response.result.question,
      })
    );
    toastService.showSuccess('Question updated successfully');
    yield put(navigateTo('/app/questions'));
  } catch (e: any) {
    yield put(
      updateQuestionErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* publishQuestionSaga(data: DeleteQuestionSagaPayloadType): any {
  try {
    const response = yield call(
      questionsService.publish,
      data.payload?.questionId
    );
    yield put(
      publishQuestionCompletedAction({
        question: response.result.question,
      })
    );

    toastService.showSuccess('Question published successfully');
  } catch (e: any) {
    yield put(
      publishQuestionErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* questionsSaga() {
  yield all([
    takeLatest(QuestionsActionType.GET_LIST, getListQuestionsSaga),
    takeLatest(QuestionsActionType.DELETE_QUESTION, deleteQuestionSaga),
    takeLatest(QuestionsActionType.GET_QUESTION, getQuestionSaga),
    takeLatest(QuestionsActionType.CREATE_QUESTION, createQuestionSaga),
    takeLatest(QuestionsActionType.UPDATE_QUESTION, updateQuestionSaga),
    takeLatest(QuestionsActionType.PUBLISH_QUESTION, publishQuestionSaga),
  ]);
}
export default questionsSaga;
