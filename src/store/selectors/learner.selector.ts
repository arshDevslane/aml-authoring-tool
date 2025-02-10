import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { LearnerState } from '../reducers/learner.reducer';

const learnerState = (state: AppState) => state.learner;

export const isLoadingLearnersSelector = createSelector(
  [learnerState],
  (state: LearnerState) => state.isLoading
);

export const learnerEntitiesSelector = createSelector(
  [learnerState],
  (state: LearnerState) => state.entities
);

export const learnerSelector = createSelector(
  [learnerState],
  (state: LearnerState) => {
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
