import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { questionSetService } from '@/services/api-services/QuestionSetService';
import { PaginationLimit } from '@/enums/tableEnums';
import { toastService } from '@/services/ToastService';
import { QuestionSetCreateUpdatePayload } from '@/components/QuestionSet/QuestionSetListing/QuestionSetDetails/QuestionSetDetails';
import {
  createQuestionSetCompletedAction,
  deleteQuestionSetCompletedAction,
  getListQuestionSetAction,
  getListQuestionSetCompletedAction,
  getListQuestionSetErrorAction,
  getQuestionSetCompletedAction,
  getQuestionSetErrorAction,
  publishQuestionSetCompletedAction,
  QuestionSetActionPayloadType,
  updateQuestionSetCompletedAction,
} from '../actions/questionSet.actions';
import { QuestionSetActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';
import { getListBoardCompletedAction } from '../actions/board.action';

interface QuestionSetSagaPayloadType extends SagaPayloadType {
  payload: QuestionSetActionPayloadType;
}

interface CreateQuestionSetPayloadType extends SagaPayloadType {
  payload: QuestionSetCreateUpdatePayload;
}

interface UpdateQuestionSetPayloadType extends SagaPayloadType {
  payload: {
    questionSetId: string;
    data: Partial<QuestionSetCreateUpdatePayload>;
  };
}

interface DeleteQuestionSetSagaPayloadType extends SagaPayloadType {
  payload: { questionSetId: string };
}

function* getListQuestionSetSaga(data: QuestionSetSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['questionSet']['cachedData'][string] =
      yield select(
        (state: AppState) =>
          state.questionSet.cachedData[JSON.stringify(data.payload.filters)]
      );

    if (cachedData?.result) {
      const entities: AppState['questionSet']['entities'] = yield select(
        (state: AppState) => state.questionSet.entities
      );

      yield put(
        getListQuestionSetCompletedAction({
          questionSets: cachedData.result
            .map((id) => entities[id])
            .filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof questionSetService.getList>> =
      yield call(questionSetService.getList, {
        filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListQuestionSetCompletedAction({
        questionSets: response.result.question_sets,
        totalCount: response.result.meta.total,
      })
    );
    yield put(
      getListBoardCompletedAction({
        boards: response.result.boards,
        totalCount: response.result.boards.length,
        noCache: true,
      })
    );
  } catch (e: any) {
    yield put(
      getListQuestionSetErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* deleteQuestionSetSaga(data: DeleteQuestionSetSagaPayloadType): any {
  const { questionSetId } = data.payload;
  try {
    const filters: QuestionSetActionPayloadType['filters'] = yield select(
      (state: AppState) => state.questionSet.filters
    );

    yield call(questionSetService.delete, questionSetId);
    yield put(deleteQuestionSetCompletedAction());
    toastService.showSuccess('Question Set deleted successfully');
    yield put(
      getListQuestionSetAction({
        filters,
      })
    );
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* getQuestionSetSaga(data: any): any {
  try {
    const { id } = data.payload;

    const response: Awaited<ReturnType<typeof questionSetService.getById>> =
      yield call(questionSetService.getById, id);
    yield put(
      getQuestionSetCompletedAction({
        questionSet: response.result.question_set,
      })
    );
  } catch (e: any) {
    yield put(
      getQuestionSetErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* createQuestionSetSaga(data: CreateQuestionSetPayloadType): any {
  try {
    const filters: QuestionSetActionPayloadType['filters'] = yield select(
      (state: AppState) => state.questionSet.filters
    );
    const response = yield call(questionSetService.create, data.payload);
    yield put(createQuestionSetCompletedAction(response));

    toastService.showSuccess('Question Set created successfully');
    yield put(
      getListQuestionSetAction({
        filters,
      })
    );
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* updateQuestionSetSaga(data: UpdateQuestionSetPayloadType): any {
  try {
    const response = yield call(questionSetService.update, data.payload);
    yield put(updateQuestionSetCompletedAction(response));

    toastService.showSuccess('Question Set updated successfully');
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* publishQuestionSetSaga(data: DeleteQuestionSetSagaPayloadType): any {
  try {
    const response = yield call(
      questionSetService.publish,
      data.payload?.questionSetId
    );
    yield put(publishQuestionSetCompletedAction(response));

    toastService.showSuccess('Question Set published successfully');
  } catch (e: any) {
    toastService.showError((e?.errors && e.errors[0]?.message) || e?.message);
  }
}

function* questionSetSaga() {
  yield all([
    takeLatest(QuestionSetActionType.GET_LIST, getListQuestionSetSaga),
    takeLatest(
      QuestionSetActionType.DELETE_QUESTION_SET,
      deleteQuestionSetSaga
    ),
    takeLatest(QuestionSetActionType.GET_QUESTION_SET, getQuestionSetSaga),
    takeLatest(
      QuestionSetActionType.CREATE_QUESTION_SET,
      createQuestionSetSaga
    ),
    takeLatest(
      QuestionSetActionType.UPDATE_QUESTION_SET,
      updateQuestionSetSaga
    ),
    takeLatest(
      QuestionSetActionType.PUBLISH_QUESTION_SET,
      publishQuestionSetSaga
    ),
  ]);
}

export default questionSetSaga;
