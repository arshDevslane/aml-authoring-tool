import { Repository } from '@/models/entities/Repository';
import { RepositoryActionType } from './actions.constants';

export type RepositoryActionPayloadType = {
  filters: Partial<{
    searchQuery: string;
    status: string;
    is_active: boolean | null;
    page_no: number;
  }>;
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
