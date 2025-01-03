import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { userReducer } from './user.reducer';
import { navigationReducer } from './NavigationReducer';
import { AuthActionType } from '../actions/actions.constants';
import { questionSetReducer } from './questionSet.reducer';
import { questionsReducer } from './questions.reducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  questionSet: questionSetReducer,
  questions: questionsReducer,
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
