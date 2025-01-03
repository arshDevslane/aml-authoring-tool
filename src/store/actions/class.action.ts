import { ClassActionType } from './actions.constants';

export type ClassActionPayloadType = {
  filters: Partial<{
    searchQuery: string;
    page_no: number;
  }>;
};

export const getListClassAction = (payload: ClassActionPayloadType) => ({
  type: ClassActionType.GET_LIST,
  payload,
});

export const getListClassCompletedAction = (payload: any) => ({
  type: ClassActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListClassErrorAction = (message: string) => ({
  type: ClassActionType.GET_LIST_ERROR,
  payload: message,
});
