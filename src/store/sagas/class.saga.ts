import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { classService } from '@/services/api-services/ClassService';
import { PaginationLimit } from '@/enums/tableEnums';
import { AppState } from '../reducers';
import {
  ClassActionPayloadType,
  getListClassCompletedAction,
  getListClassErrorAction,
} from '../actions/class.action';
import { ClassActionType } from '../actions/actions.constants';

interface ClassSagaPayloadType extends SagaPayloadType {
  payload: ClassActionPayloadType;
}

function* getListClassSaga(data: ClassSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['class']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.class.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entries: AppState['class']['entries'] = yield select(
        (state: AppState) => state.class.entries
      );
      yield put(
        getListClassCompletedAction({
          classes: cachedData.result.map((id) => entries[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof classService.getList>> =
      yield call(classService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListClassCompletedAction({
        classes: response.result.classes,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListClassErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

export function* classSaga() {
  yield all([takeLatest(ClassActionType.GET_LIST, getListClassSaga)]);
}
