import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import questionSetSaga from './questionSet.saga';
import repositorySaga from './repository.saga';
import { boardSaga } from './board.saga';
import { classSaga } from './class.saga';
import { skillSaga } from './skill.saga';
import { subSkillSaga } from './subSkill.saga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(questionSetSaga),
    fork(repositorySaga),
    fork(boardSaga),
    fork(classSaga),
    fork(skillSaga),
    fork(subSkillSaga),
  ]);
}
