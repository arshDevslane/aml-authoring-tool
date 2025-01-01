import { SagaPayloadType } from '@/types/SagaPayload.type';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AuthActionType } from '@/store/actions/actions.constants';
import {
  authFetchMeCompletedAction,
  authFetchMeErrorAction,
  AuthLoginActionPayloadType,
  authLoginCompletedAction,
  authLoginErrorAction,
} from '@/store/actions/auth.action';
import { authService } from '@/services/api-services/AuthService';
import { localStorageService } from '@/services/LocalStorageService';
import { toastService } from '@/services/ToastService';

interface LoginSagaPayloadType extends SagaPayloadType {
  payload: AuthLoginActionPayloadType;
}

function* loginSaga(data: LoginSagaPayloadType): any {
  try {
    const response = yield call(authService.login, data.payload);
    yield put(authLoginCompletedAction(response?.result?.data?.user));
    localStorageService.setAuthToken(response?.result?.data?.token);
    toastService.showSuccess('Logged in successfully');
  } catch (e: any) {
    yield put(
      authLoginErrorAction((e?.errors && e.errors[0]?.message) || e?.message)
    );
  }
}

function* fetchLoggedInUserSaga(): any {
  try {
    const response = yield call(authService.fetchMe);
    yield put(authFetchMeCompletedAction(response.result?.data?.user));
  } catch (e: any) {
    localStorageService.removeAuthToken();
    yield put(authFetchMeErrorAction(e?.message));
  }
}

function* logoutSaga(): any {
  try {
    // const response = yield call(authService.logout);
    localStorageService.removeAuthToken();
    toastService.showSuccess('Logged out successfully');
  } catch (e: any) {
    toastService.showError(`${e?.message}`);
    yield put(authFetchMeErrorAction(e?.message));
  }
}

function* authSaga() {
  yield all([
    takeLatest(AuthActionType.LOGIN, loginSaga),
    takeLatest(AuthActionType.FETCH_ME, fetchLoggedInUserSaga),
    takeLatest(AuthActionType.LOGOUT, logoutSaga),
  ]);
}

export default authSaga;
