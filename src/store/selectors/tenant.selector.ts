import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { TenantState } from '../reducers/tenant.reducer';

const tenantState = (state: AppState) => state.tenant;

export const tenantSelector = createSelector(
  [tenantState],
  (state: TenantState) => {
    const filterKey = JSON.stringify(state.filters);
    const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
      result: [],
      totalCount: state.latestCount ?? 0,
    };

    return {
      result: resultIDs?.map((id) => state.entities[id]).filter(Boolean),
      totalCount,
    };
  }
);

export const isLoadingTenantsSelector = createSelector(
  [tenantState],
  (state: TenantState) => state.isLoading
);

export const tenantEntitiesSelector = createSelector(
  [tenantState],
  (state: TenantState) => state.entities
);
