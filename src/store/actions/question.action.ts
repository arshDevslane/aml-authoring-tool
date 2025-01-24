import { Question } from '@/models/entities/Question';
import { QuestionType } from '@/models/enums/QuestionType.enum';
import { User } from '@/models/entities/User';
import { QuestionSet } from '@/models/entities/QuestionSet';
import { Class } from '@/models/entities/Class';
import { Board } from '@/models/entities/Board';
import { Repository } from '@/models/entities/Repository';
import { Skill } from '@/models/entities/Skill';
import { QuestionsActionType } from './actions.constants';

export type QuestionsActionPayloadType = {
  filters: Partial<{
    search_query: string;
    question_type: Array<QuestionType>;
    question_set_id: string;
    repository_id: string;
    board_id: string;
    class_id: string;
    l1_skill_id: string;
    l2_skill_id: string;
    l3_skill_id: string;
    sub_skill_id: string;
  }> & { page_no: number; sortOrder?: string; orderBy?: string };
  noCache?: boolean;
};
export type QuestionsResponseType = {
  questions: Question[];
  totalCount: number;
  users?: User[];
  classes?: Class[];
  boards?: Board[];
  repositories?: Repository[];
  skills?: Skill[];
  questionSets?: QuestionSet[];
  noCache?: boolean;
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

export const deleteQuestionErrorAction = (message: string) => ({
  type: QuestionsActionType.DELETE_QUESTION_ERROR,
  payload: message,
});

export const getQuestionAction = (payload: { id: string }) => ({
  type: QuestionsActionType.GET_QUESTION,
  payload,
});

export const getQuestionCompletedAction = (payload: {
  question: Question;
  questionSets: QuestionSet[];
  classes?: Class[];
  boards?: Board[];
  repositories?: Repository[];
  skills?: Skill[];
}) => ({
  type: QuestionsActionType.GET_QUESTION_COMPLETED,
  payload,
});

export const getQuestionErrorAction = (message: string) => ({
  type: QuestionsActionType.GET_QUESTION_ERROR,
  payload: message,
});

export const createQuestionAction = (question: any) => ({
  type: QuestionsActionType.CREATE_QUESTION,
  question,
});

export const createQuestionCompletedAction = (payload: {
  question: Question;
}) => ({
  type: QuestionsActionType.CREATE_QUESTION_COMPLETED,
  payload,
});

export const createQuestionErrorAction = (message: string) => ({
  type: QuestionsActionType.CREATE_QUESTION_ERROR,
  payload: message,
});

export const updateQuestionAction = (payload: {
  id: string;
  question: any;
  navigate: boolean;
}) => ({
  type: QuestionsActionType.UPDATE_QUESTION,
  payload,
});

export const updateQuestionCompletedAction = (payload: {
  question: Question;
}) => ({
  type: QuestionsActionType.UPDATE_QUESTION_COMPLETED,
  payload,
});

export const updateQuestionErrorAction = (message: string) => ({
  type: QuestionsActionType.UPDATE_QUESTION_ERROR,
  payload: message,
});

export const publishQuestionAction = (questionId: string) => ({
  type: QuestionsActionType.PUBLISH_QUESTION,
  payload: { questionId },
});

export const publishQuestionCompletedAction = (payload: any) => ({
  type: QuestionsActionType.PUBLISH_QUESTION_COMPLETED,
  payload,
});

export const publishQuestionErrorAction = (message: string) => ({
  type: QuestionsActionType.PUBLISH_QUESTION_ERROR,
  payload: message,
});
