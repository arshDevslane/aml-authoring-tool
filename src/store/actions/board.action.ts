import { BoardActionType } from './actions.constants';

export type BoardActionPayloadType = {
  filters: Partial<{
    searchQuery: string;
    page_no: number;
  }>;
};

export const getListBoardAction = (payload: BoardActionPayloadType) => ({
  type: BoardActionType.GET_LIST,
  payload,
});

export const getListBoardCompletedAction = (payload: any) => ({
  type: BoardActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListBoardErrorAction = (message: string) => ({
  type: BoardActionType.GET_LIST_ERROR,
  payload: message,
});
