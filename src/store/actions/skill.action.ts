import { SkillActionType } from './actions.constants';

export type SkillActionPayloadType = {
  filters: Partial<{
    search_query: string;
    skill_type: string;
    page_no: number;
  }>;
};

export const getListSkillAction = (payload: SkillActionPayloadType) => ({
  type: SkillActionType.GET_LIST,
  payload,
});

export const getListSkillCompletedAction = (payload: any) => ({
  type: SkillActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListSkillErrorAction = (message: string) => ({
  type: SkillActionType.GET_LIST_ERROR,
  payload: message,
});
