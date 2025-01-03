import { SubskillActionType } from './actions.constants';

export type SubskillActionPayloadType = {
  filters: Partial<{
    searchQuery: string;
    page_no: number;
  }>;
};

export const getListSubSkillAction = (payload: SubskillActionPayloadType) => ({
  type: SubskillActionType.GET_LIST,
  payload,
});

export const getListSubSkillCompletedAction = (payload: any) => ({
  type: SubskillActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListSubSkillErrorAction = (message: string) => ({
  type: SubskillActionType.GET_LIST_ERROR,
  payload: message,
});
