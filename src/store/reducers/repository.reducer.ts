/* eslint-disable no-case-declarations */
import produce from 'immer';
import { Repository } from '@/models/entities/Repository';
import { CacheAPIResponse } from '@/lib/utils';
import { RepositoryActionType } from '../actions/actions.constants';
import { RepositoryActionPayloadType } from '../actions/repository.action';

export type RepositoryState = RepositoryActionPayloadType & {
  cachedData: CacheAPIResponse;
  entries: Record<string, Repository>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: RepositoryState = {
  isLoading: false,
  filters: {
    searchQuery: '',
    status: '',
    is_active: null,
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entries: {},
};

export const repositoryReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: RepositoryState = initialState,
  action: any
) =>
  produce(state, (draft: RepositoryState) => {
    switch (action.type) {
      case RepositoryActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case RepositoryActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const repositoryMap = action.payload.repositories.reduce(
          (acc: any, repository: Repository) => ({
            ...acc,
            [repository.identifier]: repository,
          }),
          {} as Record<string, Repository>
        );

        draft.entries = { ...state.entries, ...repositoryMap };
        draft.cachedData[filterKey] = {
          result: action.payload.repositories.map(
            (repository: Repository) => repository.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case RepositoryActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
