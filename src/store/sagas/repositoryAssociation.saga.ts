import { toastService } from '@/services/ToastService';
import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { RepositoryAssociationCreatePayload } from '@/components/Repository/RepositoryAssociate/RepositoryAssociationAddForm';
import { repositoryAssociationService } from '@/services/api-services/RepositoryAssociationService';
import { RepositoryAssociationActionType } from '../actions/actions.constants';
import {
  createRepositoryAssociationCompletedAction,
  createRepositoryAssociationErrorAction,
  deleteRepositoryAssociationCompletedAction,
  deleteRepositoryAssociationErrorAction,
  getRepositoryAssociationByIdCompletedAction,
  getRepositoryAssociationByIdErrorAction,
} from '../actions/repositoryAssociation.action';

interface DeleteRepositoryAssociationSagaPayloadType extends SagaPayloadType {
  payload: { repositoryAssociationId: string; repositoryId: string };
}
interface CreateRepositoryAssociatePayloadType extends SagaPayloadType {
  payload: RepositoryAssociationCreatePayload;
}

function* getRepositoryAssociationByIdSaga(data: any): any {
  try {
    const { id } = data.payload;
    const response: Awaited<
      ReturnType<typeof repositoryAssociationService.getById>
    > = yield call(repositoryAssociationService.getById, id);
    yield put(
      getRepositoryAssociationByIdCompletedAction({
        repository_associations: response.result.repository_associations,
        boards: response.result.boards,
        learners: response.result.learners,
        repositories: response.result.repositories,
        tenants: response.result.tenants,
        id,
      })
    );
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(getRepositoryAssociationByIdErrorAction(errorMessage));
  }
}

function* createRepositoryAssociateSaga(
  data: CreateRepositoryAssociatePayloadType
): any {
  try {
    const response = yield call(
      repositoryAssociationService.create,
      data.payload
    );

    yield put(createRepositoryAssociationCompletedAction(response.result));
    toastService.showSuccess('Repository Association created successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    yield put(createRepositoryAssociationErrorAction(errorMessage));
    toastService.showError(errorMessage);
  }
}

function* deleteRepositoryAssociationSaga(
  data: DeleteRepositoryAssociationSagaPayloadType
): any {
  const { repositoryAssociationId } = data.payload;
  try {
    yield call(repositoryAssociationService.delete, repositoryAssociationId);
    yield put(
      deleteRepositoryAssociationCompletedAction(repositoryAssociationId)
    );
    toastService.showSuccess(' Repository Association deleted successfully');
  } catch (e: any) {
    const errorMessage = e?.response?.data?.error?.message;
    toastService.showError(errorMessage);
    yield put(deleteRepositoryAssociationErrorAction(errorMessage));
  }
}

function* repositoryAssociationSaga() {
  yield all([
    takeLatest(
      RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATION,
      createRepositoryAssociateSaga
    ),
    takeLatest(
      RepositoryAssociationActionType.GET_BY_ID,
      getRepositoryAssociationByIdSaga
    ),
    takeLatest(
      RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION,
      deleteRepositoryAssociationSaga
    ),
  ]);
}

export default repositoryAssociationSaga;
