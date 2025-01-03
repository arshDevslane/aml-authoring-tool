import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { userReducer } from './user.reducer';
import { navigationReducer } from './NavigationReducer';
import { AuthActionType } from '../actions/actions.constants';
import { questionSetReducer } from './questionSet.reducer';
import { repositoryReducer } from './repository.reducer';
import { boardReducer } from './board.reducer';
import { classReducer } from './class.reducer';
import { skillReducer } from './skill.reducer';
import { subSkillReducer } from './subSkill.reducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  questionSet: questionSetReducer,
  repository: repositoryReducer,
  board: boardReducer,
  class: classReducer,
  skill: skillReducer,
  subSkill: subSkillReducer,
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
