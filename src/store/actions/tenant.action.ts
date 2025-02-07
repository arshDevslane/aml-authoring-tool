import { TenantActionType } from './actions.constants';

export type TenantActionPayloadType = {
  filters: Partial<{
    page_no: number;
  }>;
};

export const getListTenantAction = (payload: TenantActionPayloadType) => ({
  type: TenantActionType.GET_LIST,
  payload,
});

export const getListTenantCompletedAction = (payload: any) => ({
  type: TenantActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListTenantErrorAction = (message: string) => ({
  type: TenantActionType.GET_LIST_ERROR,
  payload: message,
});
