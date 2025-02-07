/* eslint-disable no-case-declarations */
import { CacheAPIResponse } from '@/lib/utils';
import { Tenants } from '@/models/entities/Tenants';
import produce from 'immer';
import {
  RepositoryAssociationActionType,
  TenantActionType,
} from '../actions/actions.constants';
import { TenantActionPayloadType } from '../actions/tenant.action';

export type TenantState = TenantActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Tenants>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: TenantState = {
  isLoading: false,
  filters: {
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
};

export const tenantReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: TenantState = initialState,
  action: any
) =>
  produce(state, (draft: TenantState) => {
    switch (action.type) {
      case TenantActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case TenantActionType.GET_LIST_COMPLETED:
      case RepositoryAssociationActionType.GET_BY_ID_COMPLETED:
        draft.isLoading = false;

        const tenantMap = action.payload?.tenants?.reduce(
          (acc: any, tenant: Tenants) => ({
            ...acc,
            [tenant.identifier]: tenant,
          }),
          {} as Record<string, Tenants>
        );

        draft.entities = { ...state.entities, ...tenantMap };
        break;

      case TenantActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
