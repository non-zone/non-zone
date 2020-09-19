import React, { useMemo, useContext, useState, useEffect } from 'react';
import io from './io';

const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState();

    useEffect(() => {
        io.subscribeToUserService((data, error) => {
            console.log('On User Auth', { data, error });
            setState(
                { ...data, error } || {
                    user: null,
                    balance: 0,
                    profile: null,
                    error,
                }
            );
        });
    }, []);

    return (
        <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const state = useContext(AuthContext);
    return useMemo(
        () => ({
            user: state?.user,
            loading: !state,
            error: state?.error,
        }),
        [state]
    );
};

export const useMyPublicProfile = () => {
    const state = useContext(AuthContext);
    return useMemo(
        () => ({
            profile: state?.profile,
            loading: !state,
            error: state?.error,
        }),
        [state]
    );
};

export const useMyWallet = () => {
    const state = useContext(AuthContext);
    return useMemo(
        () => ({
            balance: state?.balance,
            loading: !state,
            error: state?.error,
        }),
        [state]
    );
};

export const signOut = () => io.signOut();

export const updateUserProfile = io.saveProfile;

export const checkInitialBalance = io.checkInitialBalance;
