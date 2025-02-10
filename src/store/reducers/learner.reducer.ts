/* eslint-disable no-case-declarations */
import { CacheAPIResponse } from '@/lib/utils';
import { Learner } from '@/models/entities/Learner';
import produce from 'immer';
import {
  LearnerActionType,
  RepositoryAssociationActionType,
} from '../actions/actions.constants';
import { LearnerActionPayloadType } from '../actions/learner.action';

export type LearnerState = LearnerActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Learner>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: LearnerState = {
  isLoading: false,
  filters: {
    search_query: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
};

export const learnerReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: LearnerState = initialState,
  action: any
) =>
  produce(state, (draft: LearnerState) => {
    switch (action.type) {
      case LearnerActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case LearnerActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const learnerMap = action.payload?.learners?.reduce(
          (acc: any, learner: Learner) => ({
            ...acc,
            [learner.identifier]: learner,
          }),
          {} as Record<string, Learner>
        );

        draft.entities = { ...state.entities, ...learnerMap };
        if (!action.payload.noCache) {
          draft.cachedData[filterKey] = {
            result: action.payload.learners?.map(
              (learner: Learner) => learner.identifier
            ),
            totalCount: action.payload.totalCount,
          };
        }
        draft.latestCount = action.payload.totalCount;
        break;
      case RepositoryAssociationActionType.GET_BY_ID_COMPLETED: {
        draft.isLoading = false;

        const learnerMap = action.payload?.learners?.reduce(
          (acc: any, learner: Learner) => ({
            ...acc,
            [learner.identifier]: learner,
          }),
          {} as Record<string, Learner>
        );

        draft.entities = { ...state.entities, ...learnerMap };
        break;
      }

      case LearnerActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
