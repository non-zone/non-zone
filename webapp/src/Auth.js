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

    useEffect(() => {
        if (!uid) return;
        console.log(`/users-public/${uid}`);
        return firebase
            .database()
            .ref(`/users-public/${uid}`)
            .on(
                'value',
                (snap) => {
                    console.log('Snap:', snap);
                    setProfile(snap?.val());
                },
                (err) => console.log('Error loading public user profile')
            );
    }, [uid]);

    return useMemo(
        () => ({
            profile: profile || null,
            loading: profile === undefined,
        }),
        [profile]
    );
};

export const googleSignIn = () => {
    firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCred) => {
            console.log('User info after sign in:', userCred);
        })
        .catch((err) => console.log('Error signing in:', err));
};

export const signout = () => firebase.auth().signOut();
