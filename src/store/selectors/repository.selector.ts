import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { RepositoryState } from '../reducers/repository.reducer';

const repositoryState = (state: AppState) => state.repository;

export const repositoriesSelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => {
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
export const filtersRepositorySelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => state.filters
);

export const isLoadingRepositoriesSelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => state.isLoading
);

export const allRepositorySelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => state.entities
);

export const isPublishingRepositorySelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => state.isPublishing
);

export const isDeletingRepositorySelector = createSelector(
  [repositoryState],
  (state: RepositoryState) => state.isDeleting
);
