import { LearnerActionType } from './actions.constants';

export type LearnerActionPayloadType = {
  filters: Partial<{
    page_no: number;
  }>;
};

export const getListLearnerAction = (payload: LearnerActionPayloadType) => ({
  type: LearnerActionType.GET_LIST,
  payload,
});

export const getListLearnerCompletedAction = (payload: any) => ({
  type: LearnerActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListLearnerErrorAction = (message: string) => ({
  type: LearnerActionType.GET_LIST_ERROR,
  payload: message,
});
