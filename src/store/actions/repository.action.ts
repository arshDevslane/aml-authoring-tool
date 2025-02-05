import { Repository } from '@/models/entities/Repository';
import { RepositoryActionType } from './actions.constants';

export type RepositoryActionPayloadType = {
  filters: Partial<{
    search_query: string;
    status: string;
    is_active: boolean | null;
  }> & { page_no: number };
};

export const getListRepositoryAction = (
  payload: RepositoryActionPayloadType
) => ({
  type: RepositoryActionType.GET_LIST,
  payload,
});

export const getListRepositoryCompletedAction = (payload: {
  repositories: Repository[];
  totalCount: number;
}) => ({
  type: RepositoryActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListRepositoryErrorAction = (message: string) => ({
  type: RepositoryActionType.GET_LIST_ERROR,
  payload: message,
});

export const getRepositoryByIdAction = (id: string) => ({
  type: RepositoryActionType.GET_BY_ID,
  payload: { id },
});

export const getRepositoryByIdCompletedAction = (payload: any) => ({
  type: RepositoryActionType.GET_BY_ID_COMPLETED,
  payload,
});

export const getRepositoryByIdErrorAction = (message: string) => ({
  type: RepositoryActionType.GET_BY_ID_ERROR,
  payload: message,
});

export const createRepositoryAction = (payload: any) => ({
  type: RepositoryActionType.CREATE_REPOSITORY,
  payload,
});

export const createRepositoryCompletedAction = (payload: any) => ({
  type: RepositoryActionType.CREATE_REPOSITORY_COMPLETED,
  payload,
});

export const createRepositoryErrorAction = (message: string) => ({
  type: RepositoryActionType.CREATE_REPOSITORY_ERROR,
  payload: message,
});

export const updateRepositoryAction = (payload: {
  repositoryId: string;
  data: any;
}) => ({
  type: RepositoryActionType.UPDATE_REPOSITORY,
  payload,
});

export const updateRepositoryCompletedAction = (payload: any) => ({
  type: RepositoryActionType.UPDATE_REPOSITORY_COMPLETED,
  payload,
});

export const updateRepositoryErrorAction = (message: string) => ({
  type: RepositoryActionType.UPDATE_REPOSITORY_ERROR,
  payload: message,
});

export const deleteRepositoryAction = (repositoryId: string) => ({
  type: RepositoryActionType.DELETE_REPOSITORY,
  payload: { repositoryId },
});

export const deleteRepositoryCompletedAction = () => ({
  type: RepositoryActionType.DELETE_REPOSITORY_COMPLETED,
  payload: {},
});

export const deleteRepositoryErrorAction = (message: string) => ({
  type: RepositoryActionType.DELETE_REPOSITORY_ERROR,
  payload: message,
});

export const publishRepositoryAction = (repositoryId: string) => ({
  type: RepositoryActionType.PUBLISH_REPOSITORY,
  payload: { repositoryId },
});

export const publishRepositoryCompletedAction = (payload: any) => ({
  type: RepositoryActionType.PUBLISH_REPOSITORY_COMPLETED,
  payload,
});

export const publishRepositoryErrorAction = (message: string) => ({
  type: RepositoryActionType.PUBLISH_REPOSITORY_ERROR,
  payload: message,
});
