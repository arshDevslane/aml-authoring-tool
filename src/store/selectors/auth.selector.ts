import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { AuthState } from '../reducers/auth.reducer';

const authState = (state: AppState) => state.auth;

export const isAuthenticatedSelector = createSelector(
  [authState],
  (state: AuthState) => Boolean(state.user)
);

export const isAuthLoadingSelector = createSelector(
  [authState],
  (state: AuthState) => Boolean(state.loading)
);

export const authErrorSelector = createSelector(
  [authState],
  (state: AuthState) => state.error
);
