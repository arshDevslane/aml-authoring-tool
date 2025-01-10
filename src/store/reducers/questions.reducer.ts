import produce from 'immer';
import { Question } from '@/models/entities/Question';
import { CacheAPIResponse } from '@/lib/utils';
import { QuestionsActionType } from '../actions/actions.constants';
import { QuestionsActionPayloadType } from '../actions/question.action';

export type QuestionsState = QuestionsActionPayloadType & {
  isLoading: boolean;
  error?: string;
  entities: Record<string, Question>;
  cachedData: CacheAPIResponse;
  latestCount: number;
  isPublishing: boolean;
};
const initialState: QuestionsState = {
  isLoading: false,
  entities: {},
  cachedData: {},
  latestCount: 0,
  filters: {
    page_no: 1,
  },
  isPublishing: false,
};
export const questionsReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: QuestionsState = initialState,
  action: any
) =>
  produce(state, (draft: QuestionsState) => {
    switch (action.type) {
      case QuestionsActionType.GET_LIST: {
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      }
      case QuestionsActionType.GET_LIST_COMPLETED: {
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const questionsMap = action.payload.questions.reduce(
          (acc: any, question: Question) => ({
            ...acc,
            [question.identifier]: question,
          }),
          {} as Record<string, Question>
        );

        draft.entities = { ...state.entities, ...questionsMap };
        draft.cachedData[filterKey] = {
          result: action.payload.questions.map(
            (question: Question) => question.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      }
      case QuestionsActionType.GET_LIST_ERROR: {
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      }
      case QuestionsActionType.DELETE_QUESTION_COMPLETED: {
        draft.entities = {};
        draft.cachedData = {};
        break;
      }
      case QuestionsActionType.GET_QUESTION: {
        draft.isLoading = true;
        break;
      }
      case QuestionsActionType.GET_QUESTION_COMPLETED: {
        draft.isLoading = false;
        draft.entities = {
          ...state.entities,
          [action.payload.question.identifier]: action.payload.question,
        };
        break;
      }
      case QuestionsActionType.PUBLISH_QUESTION: {
        draft.isPublishing = true;
        break;
      }
      case QuestionsActionType.PUBLISH_QUESTION_COMPLETED: {
        draft.isPublishing = false;
        break;
      }
      case QuestionsActionType.GET_QUESTION_ERROR:
      case QuestionsActionType.PUBLISH_QUESTION_ERROR: {
        draft.isLoading = false;
        draft.isPublishing = false;
        draft.error = action.payload;
        break;
      }
      default:
        break;
    }
  });
