import { all } from 'redux-saga/effects';
import authSagas from './auth-saga';
import toastSagas from './toast-saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    toastSagas()
  ]);
}
