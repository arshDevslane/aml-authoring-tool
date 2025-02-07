import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import questionSetSaga from './questionSet.saga';
import questionsSaga from './questions.saga';
import repositorySaga from './repository.saga';
import { boardSaga } from './board.saga';
import { classSaga } from './class.saga';
import { skillSaga } from './skill.saga';
import { subSkillSaga } from './subSkill.saga';
import { contentSaga } from './content.saga';
import { mediaSaga } from './media.saga';
import translationSaga from './translation.saga';
import { ttsSaga } from './tts.saga';
import { audioSaga } from './audio.saga';
import repositoryAssociationSaga from './repositoryAssociation.saga';
import { tenantSaga } from './tenant.saga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(questionSetSaga),
    fork(questionsSaga),
    fork(repositorySaga),
    fork(repositoryAssociationSaga),
    fork(tenantSaga),
    fork(boardSaga),
    fork(classSaga),
    fork(skillSaga),
    fork(subSkillSaga),
    fork(contentSaga),
    fork(mediaSaga),
    fork(translationSaga),
    fork(ttsSaga),
    fork(audioSaga),
  ]);
}
