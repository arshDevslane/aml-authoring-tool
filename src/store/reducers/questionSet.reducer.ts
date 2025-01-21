/* eslint-disable no-case-declarations */
import produce from 'immer';
import { QuestionSet } from '@/models/entities/QuestionSet';
import { CacheAPIResponse } from '@/lib/utils';
import { QuestionSetActionPayloadType } from '../actions/questionSet.actions';
import {
  QuestionsActionType,
  QuestionSetActionType,
} from '../actions/actions.constants';

export type QuestionSetState = QuestionSetActionPayloadType & {
  isLoading: boolean;
  error?: string;
  latestCount: number;
  entities: Record<string, QuestionSet>;
  cachedData: CacheAPIResponse;

  actionInProgress: boolean;
};

const initialState: QuestionSetState = {
  isLoading: false,
  filters: {
    page_no: 1,
  },
  entities: {},
  latestCount: 0,
  cachedData: {},

  actionInProgress: false,
};

export const questionSetReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: QuestionSetState = initialState,
  action: any
) =>
  produce(state, (draft: QuestionSetState) => {
    switch (action.type) {
      case QuestionSetActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case QuestionSetActionType.GET_LIST_COMPLETED:
      case QuestionsActionType.UPDATE_QUESTION_COMPLETED:
      case QuestionsActionType.GET_QUESTION_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const questionSetMap = action.payload.questionSets?.reduce(
          (acc: any, questionSet: QuestionSet) => ({
            ...acc,
            [questionSet.identifier]: questionSet,
          }),
          {} as Record<string, QuestionSet>
        );

        draft.entities = { ...state.entities, ...questionSetMap };
        draft.cachedData[filterKey] = {
          result: action.payload.questionSets?.map(
            (questionSet: QuestionSet) => questionSet.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case QuestionSetActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;

      case QuestionSetActionType.CREATE_QUESTION_SET:
      case QuestionSetActionType.UPDATE_QUESTION_SET:
      case QuestionSetActionType.PUBLISH_QUESTION_SET:
        draft.actionInProgress = true;
        break;

      case QuestionSetActionType.DELETE_QUESTION_SET_COMPLETED:
      case QuestionSetActionType.CREATE_QUESTION_SET_COMPLETED:
        draft.actionInProgress = false;
        draft.entities = {};
        draft.cachedData = {};
        break;

      case QuestionSetActionType.UPDATE_QUESTION_SET_COMPLETED:
      case QuestionSetActionType.PUBLISH_QUESTION_SET_COMPLETED:
        draft.actionInProgress = false;
        draft.entities = {
          ...state.entities,
          [action.payload.result.question_set.identifier]:
            action.payload.result.question_set,
        };
        break;

      case QuestionSetActionType.GET_QUESTION_SET:
        draft.isLoading = true;
        break;
      case QuestionSetActionType.GET_QUESTION_SET_COMPLETED:
        draft.isLoading = false;
        draft.entities = {
          ...state.entities,
          [action.payload.questionSet.identifier]: action.payload.questionSet,
        };
        break;
      case QuestionSetActionType.GET_QUESTION_SET_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;

      default:
        break;
    }
  });
