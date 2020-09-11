import React, { useMemo, useContext } from 'react';
import { useSelector } from 'react-redux';
import * as api from 'nonzone-lib';

const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
    const user = useSelector((s) => s.user);

    const val = useMemo(
        () => ({
            user: user || null,
            loading: user === undefined,
        }),
        [user]
    );
    return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useUserPublicProfile = (uid) => {
    const profile = useSelector((s) => s.profile);

    return useMemo(
        () => ({
            profile: profile || null,
            loading: profile === undefined,
        }),
        [profile]
    );
};

export const useUserWallet = (uid) => {
    const balance = useSelector((s) => s.balance);

    return useMemo(
        () => ({
            balance: balance !== undefined ? balance : null,
            loading: balance === undefined,
        }),
        [balance]
    );
};

export const signout = () => api.signOut();
