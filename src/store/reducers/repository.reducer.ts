/* eslint-disable no-case-declarations */
import produce from 'immer';
import { Repository } from '@/models/entities/Repository';
import { CacheAPIResponse } from '@/lib/utils';
import {
  ContentActionType,
  QuestionsActionType,
  QuestionSetActionType,
  RepositoryActionType,
} from '../actions/actions.constants';
import { RepositoryActionPayloadType } from '../actions/repository.action';

export type RepositoryState = RepositoryActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Repository>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: RepositoryState = {
  isLoading: false,
  filters: {
    search_query: '',
    status: '',
    is_active: null,
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
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
        const repositoryMap = action.payload?.repositories?.reduce(
          (acc: any, repository: Repository) => ({
            ...acc,
            [repository.identifier]: repository,
          }),
          {} as Record<string, Repository>
        );
        draft.entities = { ...state.entities, ...repositoryMap };
        draft.cachedData[filterKey] = {
          result: action.payload?.repositories?.map(
            (repository: Repository) => repository.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case QuestionsActionType.GET_LIST_COMPLETED:
      case QuestionSetActionType.GET_LIST_COMPLETED:
      case ContentActionType.GET_LIST_COMPLETED:
      case QuestionsActionType.GET_QUESTION_COMPLETED: {
        draft.isLoading = false;
        const repositoryMap = action.payload?.repositories?.reduce(
          (acc: any, repository: Repository) => ({
            ...acc,
            [repository.identifier]: repository,
          }),
          {} as Record<string, Repository>
        );
        draft.entities = { ...state.entities, ...repositoryMap };
        break;
      }
      case RepositoryActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
