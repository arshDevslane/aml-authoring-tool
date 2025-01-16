import { QuestionSet } from '@/models/entities/QuestionSet';
import { QuestionSetActionType } from './actions.constants';

export type QuestionSetActionPayloadType = {
  filters: Partial<{
    is_active: boolean;
    status: string;
    search_query: string;
    repository_id: string;
    board_id: string;
    class_id: string;
    l1_skill_id: string;
    l2_skill_id: string;
    l3_skill_id: string;
    sub_skill_id: string;
  }> & { page_no: number; sortOrder?: string; orderBy?: string };
};

export type QuestionSetResponseType = {
  questionSets: QuestionSet[];
  totalCount: number;
};

export const getListQuestionSetAction = (
  payload: QuestionSetActionPayloadType
) => ({
  type: QuestionSetActionType.GET_LIST,
  payload,
});

export const getListQuestionSetCompletedAction = (
  payload: QuestionSetResponseType
) => ({
  type: QuestionSetActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListQuestionSetErrorAction = (message: string) => ({
  type: QuestionSetActionType.GET_LIST_ERROR,
  payload: message,
});

export const deleteQuestionSetAction = (questionSetId: string) => ({
  type: QuestionSetActionType.DELETE_QUESTION_SET,
  payload: { questionSetId },
});

export const deleteQuestionSetCompletedAction = () => ({
  type: QuestionSetActionType.DELETE_QUESTION_SET_COMPLETED,
  payload: {},
});

export const getQuestionSetAction = (payload: { id: string }) => ({
  type: QuestionSetActionType.GET_QUESTION_SET,
  payload,
});

export const getQuestionSetCompletedAction = (payload: any) => ({
  type: QuestionSetActionType.GET_QUESTION_SET_COMPLETED,
  payload,
});

export const getQuestionSetErrorAction = (message: string) => ({
  type: QuestionSetActionType.GET_QUESTION_SET_ERROR,
  payload: message,
});

export const createQuestionSetAction = (payload: any) => ({
  type: QuestionSetActionType.CREATE_QUESTION_SET,
  payload,
});

export const createQuestionSetCompletedAction = (payload: any) => ({
  type: QuestionSetActionType.CREATE_QUESTION_SET_COMPLETED,
  payload,
});

export const updateQuestionSetAction = (payload: {
  questionSetId: string;
  data: any;
}) => ({
  type: QuestionSetActionType.UPDATE_QUESTION_SET,
  payload,
});

export const updateQuestionSetCompletedAction = (payload: any) => ({
  type: QuestionSetActionType.UPDATE_QUESTION_SET_COMPLETED,
  payload,
});

export const publishQuestionSetAction = (questionSetId: string) => ({
  type: QuestionSetActionType.PUBLISH_QUESTION_SET,
  payload: { questionSetId },
});

export const publishQuestionSetCompletedAction = (payload: any) => ({
  type: QuestionSetActionType.PUBLISH_QUESTION_SET_COMPLETED,
  payload,
});
