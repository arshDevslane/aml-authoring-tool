import produce from 'immer';
import {
  QuestionsActionPayloadType,
  QuestionsResponseType,
} from '../actions/question.action';
import { QuestionsActionType } from '../actions/actions.constants';

export type QuestionsState = QuestionsActionPayloadType &
  QuestionsResponseType & {
    isLoading: boolean;
    error?: string;
  };
const initialState: QuestionsState = {
  isLoading: false,
  questions: [],
  totalCount: 0,
  filters: {
    page_no: 1,
  },
};
export const questionsReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: QuestionsState = initialState,
  action: any
) =>
  produce(state, (draft: QuestionsState) => {
    switch (action.type) {
      case QuestionsActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case QuestionsActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;
        draft.questions = action.payload.questions;
        draft.totalCount = action.payload.totalCount;
        break;
      case QuestionsActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
