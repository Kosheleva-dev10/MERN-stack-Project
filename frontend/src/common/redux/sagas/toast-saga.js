import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { removeToast } from '../actions/toast-actions';

// Constants
import {
    TOAST_ADD,
} from '../actions/types';

export function* watchToastAdd() {
    yield takeEvery(TOAST_ADD, autoRemoveToast);
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

function* autoRemoveToast({ payload }) {
    const { id } = payload;
    yield call(delay, 5000);
    yield put(removeToast(id));
}

export default function* rootSaga() {
    yield all([
        fork(watchToastAdd),
    ]);
}