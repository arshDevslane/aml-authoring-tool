import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { repositoryService } from '@/services/api-services/RepositoryService';
import { PaginationLimit } from '@/enums/tableEnums';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { toastService } from '@/services/ToastService';
import { RepositoryCreateUpdatePayload } from '@/components/Repository/RepositoryAddEditForm';
import { RepositoryActionType } from '../actions/actions.constants';
import {
  createRepositoryCompletedAction,
  createRepositoryErrorAction,
  deleteRepositoryCompletedAction,
  deleteRepositoryErrorAction,
  getListRepositoryAction,
  getListRepositoryCompletedAction,
  getListRepositoryErrorAction,
  getRepositoryByIdCompletedAction,
  getRepositoryByIdErrorAction,
  publishRepositoryCompletedAction,
  publishRepositoryErrorAction,
  RepositoryActionPayloadType,
  updateRepositoryCompletedAction,
  updateRepositoryErrorAction,
} from '../actions/repository.action';
import { AppState } from '../reducers';

interface DeleteRepositorySagaPayloadType extends SagaPayloadType {
  payload: { repositoryId: string };
}
interface CreateRepositoryPayloadType extends SagaPayloadType {
  payload: RepositoryCreateUpdatePayload;
}

interface UpdateRepositoryPayloadType extends SagaPayloadType {
  payload: {
    repositoryId: string;
    data: Partial<RepositoryCreateUpdatePayload>;
  };
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

function* getRepositoryByIdSaga(data: any): any {
  try {
    const { id } = data.payload;
    const response: Awaited<ReturnType<typeof repositoryService.getById>> =
      yield call(repositoryService.getById, id);
    yield put(getRepositoryByIdCompletedAction(response));
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(getRepositoryByIdErrorAction(errorMessage));
  }
}

function* createRepositorySaga(data: CreateRepositoryPayloadType): any {
  try {
    const filters: RepositoryActionPayloadType['filters'] = yield select(
      (state: AppState) => state.repository.filters
    );
    const response = yield call(repositoryService.create, data.payload);
    yield put(createRepositoryCompletedAction(response));
    toastService.showSuccess('Repository created successfully');
    yield put(getListRepositoryAction({ filters }));
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(createRepositoryErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* updateRepositorySaga(data: UpdateRepositoryPayloadType): any {
  try {
    const response = yield call(repositoryService.update, data.payload);
    yield put(updateRepositoryCompletedAction(response.result));

    toastService.showSuccess('Repository updated successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(updateRepositoryErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}
function* deleteRepositorySaga(data: DeleteRepositorySagaPayloadType): any {
  const { repositoryId } = data.payload;
  try {
    const filters: RepositoryActionPayloadType['filters'] = yield select(
      (state: AppState) => state.repository.filters
    );

    yield call(repositoryService.delete, repositoryId);
    yield put(deleteRepositoryCompletedAction());
    toastService.showSuccess(' Repository deleted successfully');
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

function* publishRepositorySaga(data: DeleteRepositorySagaPayloadType): any {
  try {
    const response = yield call(
      repositoryService.publish,
      data.payload?.repositoryId
    );
    yield put(
      publishRepositoryCompletedAction({
        repository: response.result.repository,
      })
    );

    toastService.showSuccess('Repository published successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(publishRepositoryErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* repositorySaga() {
  yield all([
    takeLatest(RepositoryActionType.GET_LIST, getListRepositorySaga),
    takeLatest(RepositoryActionType.GET_BY_ID, getRepositoryByIdSaga),
    takeLatest(RepositoryActionType.CREATE_REPOSITORY, createRepositorySaga),
    takeLatest(RepositoryActionType.UPDATE_REPOSITORY, updateRepositorySaga),
    takeLatest(RepositoryActionType.DELETE_REPOSITORY, deleteRepositorySaga),
    takeLatest(RepositoryActionType.PUBLISH_REPOSITORY, publishRepositorySaga),
  ]);
}

export default repositorySaga;
