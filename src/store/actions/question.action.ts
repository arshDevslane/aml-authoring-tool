import { Question } from '@/models/entities/Question';
import { QuestionsActionType } from './actions.constants';

export type QuestionsActionPayloadType = {
  filters: {
    page_no: number;
  };
};
export type QuestionsResponseType = {
  questions: Question[];
  totalCount: number;
};
export const getListQuestionsAction = (
  payload: QuestionsActionPayloadType
) => ({
  type: QuestionsActionType.GET_LIST,
  payload,
});
export const getListQuestionsCompletedAction = (
  payload: QuestionsResponseType
) => ({
  type: QuestionsActionType.GET_LIST_COMPLETED,
  payload,
});
export const getListQuestionsErrorAction = (message: string) => ({
  type: QuestionsActionType.GET_LIST_ERROR,
  payload: message,
});
