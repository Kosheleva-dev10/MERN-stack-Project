import axios from 'axios';

// Utils
import { getAccessToken, updateAccessToken, removeAccessToken } from '../utils/auth';

// Constants
import { APIServerURL } from '../constants/default-values';
import { UserRole } from '../enums/auth';

const authBaseURL = `${APIServerURL}/auth`;
const AuthAPI =  {
    signInWithEmailAndPassword: (email, password) => {
        const url = `${authBaseURL}/login`;
        return axios.post(url, { email, password }).then(res => {
            updateAccessToken(res.token);
        });
    },
    verifyAccessToken: () => {
        if (!getAccessToken()) {
            return;
        }
        const url = `${authBaseURL}/profile`;
        return axios.get(url).then(user => ({ user }), e => e);
    },
    registerUser: (registerUserDto) => {
        const url = `${authBaseURL}/register`;
        return axios.post(url, { ...registerUserDto, role: UserRole.User });
    },
    signOut: () => {
        removeAccessToken();
    },
    sendPasswordResetEmail: (email) => {

    },
}

export default AuthAPI;
