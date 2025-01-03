import { Question } from '@/models/entities/Question';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import { QuestionsActionType } from './actions.constants';

export type QuestionsActionPayloadType = {
  filters: {
    question_type: Array<QuestionType>;
    repository_id: string;
    board_id: string;
    class_id: string;
    l1_skill_id: string;
    l2_skill_id: string;
    l3_skill_id: string;
    sub_skill_id: string;
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

export const deleteQuestionAction = (questionId: string) => ({
  type: QuestionsActionType.DELETE_QUESTION,
  payload: { questionId },
});

export const deleteQuestionCompletedAction = () => ({
  type: QuestionsActionType.DELETE_QUESTION_COMPLETED,
  payload: {},
});
