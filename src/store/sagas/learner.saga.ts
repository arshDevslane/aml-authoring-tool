import { PaginationLimit } from '@/enums/tableEnums';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { learnerService } from '@/services/api-services/LearnerService';
import { LearnerActionType } from '../actions/actions.constants';
import { AppState } from '../reducers';
import {
  getListLearnerCompletedAction,
  getListLearnerErrorAction,
  LearnerActionPayloadType,
} from '../actions/learner.action';

interface LearnerSagaPayloadType extends SagaPayloadType {
  payload: LearnerActionPayloadType;
}

function* getListLearnerSaga(data: LearnerSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['learner']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.learner.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entities: AppState['learner']['entities'] = yield select(
        (state: AppState) => state.learner.entities
      );
      yield put(
        getListLearnerCompletedAction({
          learners: cachedData.result.map((id) => entities[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof learnerService.getList>> =
      yield call(learnerService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });

    yield put(
      getListLearnerCompletedAction({
        learners: response.result.learners,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListLearnerErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

export function* learnerSaga() {
  yield all([takeLatest(LearnerActionType.GET_LIST, getListLearnerSaga)]);
}
