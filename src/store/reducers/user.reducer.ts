import produce from 'immer';
import { Reducer } from 'redux';
import { AuthActionType } from '@/store/actions/actions.constants';
import { User } from '../../models/entities/User';
import { EntityState } from '../base/EntityState';

export interface UserState extends EntityState<User> {}

const initialState: UserState = {
  entities: {},
};

export const userReducer: Reducer<UserState> = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: UserState = initialState,
  action
) =>
  produce(state, (draft: UserState) => {
    switch (action.type) {
      case AuthActionType.LOGIN_COMPLETED:
      case AuthActionType.FETCH_ME_COMPLETED: {
        const user = action.payload as User;
        draft.entities[user.identifier] = user;
        break;
      }
      default: {
        break;
      }
    }
  });
