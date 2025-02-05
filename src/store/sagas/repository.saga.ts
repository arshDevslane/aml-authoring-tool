import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { repositoryService } from '@/services/api-services/RepositoryService';
import { PaginationLimit } from '@/enums/tableEnums';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { toastService } from '@/services/ToastService';
import { RepositoryActionType } from '../actions/actions.constants';
import {
  deleteRepositoryCompletedAction,
  deleteRepositoryErrorAction,
  getListRepositoryAction,
  getListRepositoryCompletedAction,
  getListRepositoryErrorAction,
  RepositoryActionPayloadType,
} from '../actions/repository.action';
import { AppState } from '../reducers';

interface DeleteRepositorySagaPayloadType extends SagaPayloadType {
  payload: { repositoryId: string };
}

function* getListRepositorySaga(data: any): any {
  try {
    const { page_no: pageNo = 1, ...filters } = data.payload.filters;
    const cachedData: AppState['repository']['cachedData'][string] =
      yield select(
        (state: AppState) =>
          state.repository.cachedData[JSON.stringify(data.payload.filters)]
      );

    if (cachedData?.result) {
      const entities: AppState['repository']['entities'] = yield select(
        (state: AppState) => state.repository.entities
      );
      yield put(
        getListRepositoryCompletedAction({
          repositories: cachedData.result
            .map((id) => entities[id])
            .filter(Boolean),
          totalCount: cachedData.totalCount,
        })
      );
      return;
    }
    const response: Awaited<ReturnType<typeof repositoryService.getList>> =
      yield call(repositoryService.getList, {
        ...filters,
        limit: PaginationLimit.PAGE_SIZE,
        offset: (pageNo - 1) * PaginationLimit.PAGE_SIZE,
      });
    yield put(
      getListRepositoryCompletedAction({
        repositories: response.result.repositories,
        totalCount: response.result.meta.total,
      })
    );
  } catch (e: any) {
    yield put(
      getListRepositoryErrorAction(
        (e?.errors && e.errors[0]?.message) || e?.message
      )
    );
  }
}

function* deleteRepositorySaga(data: DeleteRepositorySagaPayloadType): any {
  const { repositoryId } = data.payload;
  try {
    const filters: RepositoryActionPayloadType['filters'] = yield select(
      (state: AppState) => state.content.filters
    );

    yield call(repositoryService.delete, repositoryId);
    yield put(deleteRepositoryCompletedAction());
    toastService.showSuccess(' Content deleted successfully');
    yield put(
      getListRepositoryAction({
        filters,
      })
    );
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(deleteRepositoryErrorAction(errorMessage));
  }
}

function* repositorySaga() {
  yield all([
    takeLatest(RepositoryActionType.GET_LIST, getListRepositorySaga),
    takeLatest(RepositoryActionType.DELETE_REPOSITORY, deleteRepositorySaga),
  ]);
}

export default repositorySaga;
