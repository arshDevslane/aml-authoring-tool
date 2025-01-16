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
  (questionState: QuestionsState) => {
    const filterKey = JSON.stringify(questionState.filters);
    const { result: resultIDs, totalCount } = questionState.cachedData[
      filterKey
    ] || {
      result: [],
      totalCount: questionState.latestCount ?? 0,
    };
    return {
      result: resultIDs.map((id) => questionState.entities[id]).filter(Boolean),
      totalCount,
    };
  }
);

export const filtersQuestionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.filters
);

export const allQuestionsSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.entities
);

export const isPublishingSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.isPublishing
);

export const isDeletingSelector = createSelector(
  [questionsState],
  (state: QuestionsState) => state.isDeleting
);
