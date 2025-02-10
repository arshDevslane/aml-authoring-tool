import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { RepositoryAssociationState } from '../reducers/repositoryAssociation.reducer';

const repositoryAssociationState = (state: AppState) =>
  state.repositoryAssociation;

export const isLoadingRepositoriesSelector = createSelector(
  [repositoryAssociationState],
  (state: RepositoryAssociationState) => state.isLoading
);

export const allRepositoryAssociationsSelector = createSelector(
  [repositoryAssociationState],
  (state: RepositoryAssociationState) => state.entities
);
