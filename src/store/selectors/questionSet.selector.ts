import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { QuestionSetState } from '../reducers/questionSet.reducer';

const selectQuestionSetState = (state: AppState) => state.questionSet;

export const isLoadingQuestionSetsSelector = createSelector(
  [selectQuestionSetState],
  (state: QuestionSetState) => state.isLoading
);

export const questionSetsSelector = createSelector(
  [selectQuestionSetState],
  (questionSetState: QuestionSetState) => {
    const filterKey = JSON.stringify(questionSetState.filters);
    const { result: resultIDs, totalCount } = questionSetState.cachedData[
      filterKey
    ] || {
      result: [],
      totalCount: questionSetState.latestCount ?? 0,
    };

    return {
      result: resultIDs
        ?.map((id) => questionSetState.entities[id])
        ?.filter(Boolean),
      totalCount,
    };
  }
);

export const filtersQuestionSetsSelector = createSelector(
  [selectQuestionSetState],
  (state: QuestionSetState) => state.filters
);

export const allQuestionSetsSelector = createSelector(
  [selectQuestionSetState],
  (state: QuestionSetState) => state.entities
);

export const isQuestionSetActionInProgressSelector = createSelector(
  [selectQuestionSetState],
  (state: QuestionSetState) => state.actionInProgress
);
