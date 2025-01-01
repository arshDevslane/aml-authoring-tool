import produce from 'immer';
import { Reducer } from 'redux';
import { AuthActionType } from '@/store/actions/actions.constants';
import { User } from '@/models/entities/User';

export interface AuthState {
  user?: User;
  loading?: boolean;
  error?: string;
}

const initialState: AuthState = {
  loading: false,
};

export const authReducer: Reducer<AuthState> = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: AuthState = initialState,
  action: any
) =>
  produce(state, (draft: AuthState) => {
    switch (action.type) {
      case AuthActionType.LOGIN:
      case AuthActionType.FETCH_ME: {
        draft.loading = true;
        break;
      }
      case AuthActionType.LOGIN_COMPLETED:
      case AuthActionType.FETCH_ME_COMPLETED: {
        draft.user = action.payload;
        draft.loading = false;
        draft.error = undefined;
        break;
      }
      case AuthActionType.LOGIN_ERROR:
      case AuthActionType.FETCH_ME_ERROR: {
        draft.loading = false;
        draft.error = action.payload;
        break;
      }
      default:
        break;
    }
  });
