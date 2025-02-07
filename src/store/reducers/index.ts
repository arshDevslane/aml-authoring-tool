import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { userReducer } from './user.reducer';
import { navigationReducer } from './NavigationReducer';
import { AuthActionType } from '../actions/actions.constants';
import { questionSetReducer } from './questionSet.reducer';
import { questionsReducer } from './questions.reducer';
import { repositoryReducer } from './repository.reducer';
import { boardReducer } from './board.reducer';
import { classReducer } from './class.reducer';
import { skillReducer } from './skill.reducer';
import { subSkillReducer } from './subSkill.reducer';
import { contentReducer } from './content.reducer';
import { mediaReducer } from './media.reducer';
import { translationReducer } from './translation.reducer';
import { ttsReducer } from './tts.reducer';
import { audioReducer } from './audio.reducer';
import { repositoryAssociationReducer } from './repositoryAssociation.reducer';
import { tenantReducer } from './tenant.reducer';
import { learnerReducer } from './learner.reducer';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  questionSet: questionSetReducer,
  questions: questionsReducer,
  repository: repositoryReducer,
  repositoryAssociation: repositoryAssociationReducer,
  board: boardReducer,
  tenant: tenantReducer,
  learner: learnerReducer,
  class: classReducer,
  skill: skillReducer,
  subSkill: subSkillReducer,
  content: contentReducer,
  media: mediaReducer,
  navigationReducer,
  translation: translationReducer,
  tts: ttsReducer,
  audio: audioReducer,
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
