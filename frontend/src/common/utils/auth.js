import { decodeToken, isExpired } from "react-jwt";

// Constants
import { UserRole } from '../enums/auth';
import { ConstantNames } from '../constants/default-values';

export const getAccessToken = () => {
    return localStorage.getItem(ConstantNames.AccessToken);
};

export const updateAccessToken = at => {
    localStorage.setItem(ConstantNames.AccessToken, at)
};

export const removeAccessToken = () => {
    localStorage.removeItem(ConstantNames.AccessToken);
};

export const getDefaultRedirectPath = () => {
    const decodedToken = decodeToken(getAccessToken());

    console.log("decodedToken", decodedToken)

    const expiration = isExpired(getAccessToken());
    if (expiration) {
        console.log('Need to Refresh AccesToken.')
        return;
    }

    if (!decodedToken || !decodedToken.role) return '/';

    // Go to admin dashboard for Admin / SupuerAdmin
    if (isAdmin(decodedToken.role)) {
        return '/admin';
    } else {
        return '/customer';
    }
}

export const isAdmin = userRole => {
    switch(userRole) {
        case UserRole.Admin:
        case UserRole.SuperAdmin:
            return true;
        case UserRole.Customer:
            return false;
        default: return false;
    }
};

export const isSuperAdmin = userRole => {
    return userRole === UserRole.SuperAdmin;
};
