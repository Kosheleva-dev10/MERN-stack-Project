import { connect } from 'react-redux';

import { loginUser, logoutUser, verifyAccessToken } from './actions/auth-actions';
import { addToast, removeToast } from './actions/toast-actions';

// AUTHENTICATION
const mapUserStateToProps = ({ authReducer }) => {
    return {
        user: authReducer.user,
        authError: authReducer.error,
    }
}
const mapAuthDispatchToProps = { loginUserAction: loginUser, logoutUserAction: logoutUser };
export const connectAuth = connect(mapUserStateToProps, mapAuthDispatchToProps);

const mapAuthStateToProps = ({ authReducer }) => ({
    tokenVerified: !(authReducer.user === undefined),
    authenticated: !!authReducer.user,
    userRole: !authReducer.user ? null : authReducer.user.role
});
const mapAuthCheckDispatchToProps = { verifyAccessTokenAction: verifyAccessToken };
export const connectAuthCheck = connect(mapAuthStateToProps, mapAuthCheckDispatchToProps);

// TOASTS
const mapToastsToProps = ({ toastReducer }) => ({ toasts: toastReducer.toasts });
const mapToastsDispatchToProps = { addToastAction: addToast, removeToastAction: removeToast };
export const connectToasts = connect(mapToastsToProps, mapToastsDispatchToProps);
