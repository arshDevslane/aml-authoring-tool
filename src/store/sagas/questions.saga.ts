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
import { getAudioListAction } from '../actions/audio.action';

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
          noCache: data.payload.noCache ?? false,
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
        questionSets: response.result.question_sets,
        classes: response.result.classes,
        boards: response.result.boards,
        repositories: response.result.repositories,
        skills: [
          ...response.result.l1_skills,
          ...response.result.l2_skills,
          ...response.result.l3_skills,
        ],
        noCache: data.payload.noCache ?? false,
      })
    );
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(getListQuestionsErrorAction(errorMessage));
    toastService.showError(errorMessage);
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
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(deleteQuestionErrorAction(errorMessage));
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
        questionSets: response.result.question_sets,
        classes: [response.result.question.taxonomy.class],
        boards: [response.result.question.taxonomy.board],
        repositories: [response.result.question.repository],
        skills: [
          response.result.question.taxonomy.l1_skill,
          ...response.result.question.taxonomy.l2_skill,
          ...response.result.question.taxonomy.l3_skill,
        ],
      })
    );
    yield put(getAudioListAction({ questionId: id }));
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(getQuestionErrorAction(errorMessage));
    toastService.showError(errorMessage);
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
    const errorMessage = e?.response?.data?.error?.message;
    yield put(createQuestionErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* updateQuestionSaga(data: any): any {
  try {
    const { question, id, navigate } = data.payload;

    const response: Awaited<
      ReturnType<typeof questionsService.updateQuestion>
    > = yield call(questionsService.updateQuestion, { question, id });
    yield put(
      updateQuestionCompletedAction({
        question: response.result.question,
      })
    );
    toastService.showSuccess('Question updated successfully');
    if (navigate) {
      yield put(navigateTo('/app/questions'));
    }
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(updateQuestionErrorAction(errorMessage));
    toastService.showError(errorMessage);
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
    const errorMessage = e?.response?.data?.error?.message;
    yield put(publishQuestionErrorAction(errorMessage));
    toastService.showError(errorMessage);
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
