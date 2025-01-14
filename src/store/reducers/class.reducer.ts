/* eslint-disable no-case-declarations */
import produce from 'immer';
import { CacheAPIResponse } from '@/lib/utils';
import { Class } from '@/models/entities/Class';
import { ClassActionPayloadType } from '../actions/class.action';
import {
  ClassActionType,
  QuestionsActionType,
  QuestionSetActionType,
} from '../actions/actions.constants';

export type ClassState = ClassActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Class>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: ClassState = {
  isLoading: false,
  filters: {
    search_query: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
};

export const classReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: ClassState = initialState,
  action: any
) =>
  produce(state, (draft: ClassState) => {
    switch (action.type) {
      case ClassActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case ClassActionType.GET_LIST_COMPLETED:
      case QuestionsActionType.GET_LIST_COMPLETED:
      case QuestionSetActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const classMap = action.payload?.classes?.reduce(
          (acc: any, classItem: Class) => ({
            ...acc,
            [classItem.identifier]: classItem,
          }),
          {} as Record<string, Class>
        );

        draft.entities = { ...state.entities, ...classMap };

        draft.cachedData[filterKey] = {
          result: action.payload?.classes?.map(
            (classItem: Class) => classItem.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case ClassActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
