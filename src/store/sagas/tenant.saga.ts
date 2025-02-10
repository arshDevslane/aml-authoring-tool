import { PaginationLimit } from '@/enums/tableEnums';
import { tenantService } from '@/services/api-services/TenantService';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { TenantActionType } from '../actions/actions.constants';
import {
  getListTenantCompletedAction,
  getListTenantErrorAction,
  TenantActionPayloadType,
} from '../actions/tenant.action';
import { AppState } from '../reducers';

interface TenantSagaPayloadType extends SagaPayloadType {
  payload: TenantActionPayloadType;
}

function* getListTenantSaga(data: TenantSagaPayloadType): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['tenant']['cachedData'][string] = yield select(
      (state: AppState) =>
        state.tenant.cachedData[JSON.stringify(data.payload.filters)]
    );

    if (cachedData?.result) {
      const entities: AppState['tenant']['entities'] = yield select(
        (state: AppState) => state.tenant.entities
      );
      yield put(
        getListTenantCompletedAction({
          tenants: cachedData.result.map((id) => entities[id]).filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }

    const response: Awaited<ReturnType<typeof tenantService.getList>> =
      yield call(tenantService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });

    yield put(
      getListTenantCompletedAction({
        tenants: response.result,
        totalCount: response.result.length,
      })
    );
  } catch (e: any) {
    yield put(
      getListTenantErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

export function* tenantSaga() {
  yield all([takeLatest(TenantActionType.GET_LIST, getListTenantSaga)]);
}
