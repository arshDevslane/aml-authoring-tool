import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import questionsSaga from './questions.saga';

export default function* rootSaga() {
  yield all([fork(authSaga), fork(questionsSaga)]);
}
