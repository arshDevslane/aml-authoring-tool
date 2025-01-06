/* eslint-disable no-case-declarations */
import produce from 'immer';
import { QuestionSet } from '@/models/entities/QuestionSet';
import { CacheAPIResponse } from '@/lib/utils';
import { QuestionSetActionPayloadType } from '../actions/questionSet.actions';
import { QuestionSetActionType } from '../actions/actions.constants';

export type QuestionSetState = QuestionSetActionPayloadType & {
  isLoading: boolean;
  error?: string;
  latestCount: number;
  entities: Record<string, QuestionSet>;
  cachedData: CacheAPIResponse;
};

const initialState: QuestionSetState = {
  isLoading: false,
  filters: {
    title: [],
    repository_id: '',
    board_id: '',
    class_id: '',
    l1_skill_id: '',
    l2_skill_id: '',
    l3_skill_id: '',
    sub_skill_id: '',
    page_no: 1,
  },
  entities: {},
  latestCount: 0,
  cachedData: {},
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
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const questionSetMap = action.payload.questionSets.reduce(
          (acc: any, questionSet: QuestionSet) => ({
            ...acc,
            [questionSet.identifier]: questionSet,
          }),
          {} as Record<string, QuestionSet>
        );

        draft.entities = { ...state.entities, ...questionSetMap };
        draft.cachedData[filterKey] = {
          result: action.payload.questionSets.map(
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

      case QuestionSetActionType.DELETE_QUESTION_SET_COMPLETED:
        draft.entities = {};
        draft.cachedData = {};
        break;
      default:
        break;
    }
  });
