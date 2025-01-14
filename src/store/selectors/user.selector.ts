import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import { UserState } from '../reducers/user.reducer';

const userState = (state: AppState) => state.user;

export const usersSelector = createSelector(
  [userState],
  (state: UserState) => state.entities
);
