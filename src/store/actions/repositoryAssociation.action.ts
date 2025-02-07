import { RepositoryAssociationActionType } from './actions.constants';

export const getRepositoryAssociationByIdAction = (id: string) => ({
  type: RepositoryAssociationActionType.GET_BY_ID,
  payload: { id },
});

export const getRepositoryAssociationByIdCompletedAction = (payload: any) => ({
  type: RepositoryAssociationActionType.GET_BY_ID_COMPLETED,
  payload,
});

export const getRepositoryAssociationByIdErrorAction = (message: string) => ({
  type: RepositoryAssociationActionType.GET_BY_ID_ERROR,
  payload: message,
});

export const createRepositoryAssociationAction = (payload: any) => ({
  type: RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATION,
  payload,
});

export const createRepositoryAssociationCompletedAction = (payload: any) => ({
  type: RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATTION_COMPLETED,
  payload,
});

export const createRepositoryAssociationErrorAction = (message: string) => ({
  type: RepositoryAssociationActionType.CREATE_REPOSITORY_ASSOCIATTION_ERROR,
  payload: message,
});

export const deleteRepositoryAssociationAction = (
  repositoryAssociationId: string
) => ({
  type: RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION,
  payload: { repositoryAssociationId },
});

export const deleteRepositoryAssociationCompletedAction = () => ({
  type: RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION_COMPLETED,
  payload: {},
});

export const deleteRepositoryAssociationErrorAction = (message: string) => ({
  type: RepositoryAssociationActionType.DELETE_REPOSITORY_ASSOCIATION_ERROR,
  payload: message,
});
