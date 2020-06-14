import React, { useState, useEffect, useMemo, useContext } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        return firebase.auth().onIdTokenChanged(
            (user) => {
                console.debug('Loaded user', user);
                setUser(user);
            },
            (err) => {
                console.log('Error loading Auth info:', err);
                setError(err);
            }
        );
    }, []);

    const val = useMemo(
        () => ({
            user: user || null,
            loading: user === undefined,
            error,
        }),
        [user]
    );
    return <AuthContext.Provider value={val}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useUserPublicProfile = (uid) => {
    const [profile, setProfile] = useState();

    useEffect(
        () =>
            firebase
                .database()
                .ref(`/users-public/${uid}`)
                .on('value', (snap) => {
                    setProfile(snap.val());
                }),
        [uid]
    );

    return useMemo(
        () => ({
            profile: profile || null,
            loading: profile === undefined,
        }),
        [profile]
    );
};
