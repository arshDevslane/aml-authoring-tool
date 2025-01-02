import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { QuestionsState } from '../reducers/questions.reducer';

const questionsState = (state: AppState) => state.questions;
export const isLoadingQuestionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.isLoading
);
export const questionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.questions
);

export const filtersQuestionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.filters
);
export const totalCountQuestionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.totalCount
);
