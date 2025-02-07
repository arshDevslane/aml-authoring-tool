import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { LearnerState } from '../reducers/learner.reducer';

const learnerState = (state: AppState) => state.learner;

export const isLoadingTenantsSelector = createSelector(
  [learnerState],
  (state: LearnerState) => state.isLoading
);

export const learnerEntitiesSelector = createSelector(
  [learnerState],
  (state: LearnerState) => state.entities
);
