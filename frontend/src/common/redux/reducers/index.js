import { combineReducers } from 'redux';

import authReducer from './auth-reducer';
import toastReducer from './toast-reducer';

const rootReducer = combineReducers({
    authReducer,
    toastReducer
});

export default rootReducer;
