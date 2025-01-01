import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { userReducer } from './user.reducer';
import { navigationReducer } from './NavigationReducer';
import { AuthActionType } from '../actions/actions.constants';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  navigationReducer,
});

export const rootReducer = (state: any, action: any) => {
  if (action.type === AuthActionType.LOGOUT) {
    // eslint-disable-next-line
    state = {};
  }
  return appReducer(state, action);
};
export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
