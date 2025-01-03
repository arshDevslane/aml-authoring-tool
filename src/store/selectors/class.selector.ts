import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { ClassState } from '../reducers/class.reducer';

const classState = (state: AppState) => state.class;

export const classesSelector = createSelector(
  [classState],
  (state: ClassState) => {
    const filterKey = JSON.stringify(state.filters);
    const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
      result: [],
      totalCount: state.latestCount ?? 0,
    };

    return {
      result: resultIDs.map((id) => state.entries[id]).filter(Boolean),
      totalCount,
    };
  }
);

export const isLoadingClassesSelector = createSelector(
  [classState],
  (state: ClassState) => state.isLoading
);
