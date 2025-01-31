import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { ContentState } from '../reducers/content.reducer';

export const contentState = (state: AppState) => state.content;

export const isLoadingContentSelector = createSelector(
  [contentState],
  (state: ContentState) => state.isLoading
);

export const contentSelector = createSelector(
  [contentState],
  (state: ContentState) => {
    const filterKey = JSON.stringify(state.filters);
    const { result: resultIDs, totalCount } = state.cachedData[filterKey] || {
      result: [],
      totalCount: state.latestCount ?? 0,
    };

    return {
      result: resultIDs.map((id) => state.entities[id]).filter(Boolean),
      totalCount,
    };
  }
);

export const isContentActionInProgressSelector = createSelector(
  [contentState],
  (state: ContentState) => state.actionInProgress
);
export const filtersContentSelector = createSelector(
  [contentState],
  (state: ContentState) => state.filters
);

export const allContentSelector = createSelector(
  [contentState],
  (state: ContentState) => state.entities
);
export const isPublishingContentSelector = createSelector(
  [contentState],
  (state: ContentState) => state.isPublishing
);

export const isDeletingContentSelector = createSelector(
  [contentState],
  (state: ContentState) => state.isDeleting
);
