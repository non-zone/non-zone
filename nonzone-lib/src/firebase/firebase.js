import * as firebase from 'firebase/app';
// import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import firebaseConfig from '../firebaseConfig';
import firebaseConfigDev from '../firebaseConfigDev';
import { useEffect } from 'react';
import React from 'react';

const { REACT_APP_NONZONE_ENV = 'development' } = process.env;
const fbConf =
    REACT_APP_NONZONE_ENV === 'production' ? firebaseConfig : firebaseConfigDev;

console.log('Init with', fbConf);
firebase.initializeApp(fbConf);
// firebase.analytics();

export const Login = ({ onCancel, onSignedIn }) => {
    const ref = React.useRef();
    ref.current = { onCancel, onSignedIn };
    useEffect(() => {
        googleSignIn()
            .then((userCreds) => {
                console.log('userCreds', userCreds);
                return userCreds
                    ? ref.current.onSignedIn?.()
                    : ref.current.onCancel();
            })
            .catch((err) => console.error(err));
    }, []);
    return <div />;
};

/** *
 * kind: story|place
 * type: memory|search|story
 * loc: {latitude: number, longitude: number}
 */
export const saveObject = async ({
    id,
    kind,
    type,
    loc,
    uid,
    title = '',
    description = '',
    image = null,
}) => {
    if (!uid) throw new Error('uid empty');
    if (!loc || !(loc.latitude || loc.longitude))
        throw new Error('Coordinates are not detected');

    const timestamp = new Date().toISOString();
    const db = firebase.database();
    const objRef = !id
        ? db.ref(`/objects/`).push()
        : db.ref('/objects/').child(id);
    const data = {
        uid,
        kind,
        type,
        loc,
        title,
        description: description || '',
        image,
        updated: timestamp,
    };
    if (!id) {
        data.created = timestamp;
        data.published = false;
    }
    console.log('save story:', data);
    await objRef.update(data);
    return objRef.key;
};

export const publishObject = async (data) => {
    return firebase.database().ref(`/objects/`).child(data.id).update({
        published: true,
    });
};

export const loadObjectById = async (id) => {
    const snap = await firebase
        .database()
        .ref(`/objects/`)
        .child(id)
        .once('value');

    return snap && snap.val() ? { ...snap.val(), id: snap.key } : null;
};

export const loadObjectsByUser = async (uid, publishedOnly = true) => {
    const snap = await firebase
        .database()
        .ref(`/objects/`)
        .orderByChild('uid')
        .equalTo(uid)
        .once('value');

    if (!snap?.val()) return [];

    const obj = snap.val();
    console.debug('Loaded user stories', obj);
    const arr = Object.entries(obj)
        .map(([id, data]) => ({
            id,
            ...data,
        }))
        .filter((story) => !publishedOnly || !!story.published);
    console.debug('Loaded user stories arr', arr);
    return arr;
};

export const loadObjectsByRegion = async (bounds) => {
    const snap = await firebase
        .database()
        .ref(`/objects/`)
        // .orderByChild('loc')
        // .equalTo(uid)
        .once('value');

    if (!snap?.val()) return [];

    const obj = snap.val();
    console.debug('Loaded user stories', obj);
    const arr = Object.entries(obj)
        .map(([id, data]) => ({
            id,
            ...data,
        }))
        .filter((story) => !!story.published);
    console.debug('Loaded user stories arr', arr);
    return arr;
};

export const saveProfile = async (uid, data) => {
    if (!uid) throw new Error('uid empty');
    return firebase.database().ref(`/users-public/${uid}`).update(data);
};

export const subscribeToUserService = (cb) => {
    let unsubProfile;
    let unsubBalance;
    let data = { user: null, profile: null, balance: null };
    const ready = () => !!(data.user && data.profile && data.balance !== null);

    firebase.auth().onIdTokenChanged(
        (user) => {
            console.debug('Loaded user', user);
            // cb(user, null);

            if (user?.uid && user.uid === data.user?.uid) return;

            data.user = user;

            if (unsubProfile) {
                data.profile = null;
                unsubProfile();
            }
            if (unsubBalance) {
                data.balance = null;
                unsubBalance();
            }

            if (!user) {
                cb(null);
                return;
            }

            unsubProfile = subcribeToProfile(user.uid, (profile) => {
                data.profile = profile;
                ready() && cb(data);
            });
            unsubBalance = subscribeToBalance(user.uid, (balance) => {
                data.balance = balance;
                ready() && cb(data);
            });
        },
        (err) => {
            console.log('Error loading Auth info:', err);
            cb(null, err);
        }
    );
};

export const subcribeToProfile = (uid, cb) => {
    return firebase
        .database()
        .ref(`/users-public/${uid}`)
        .on(
            'value',
            (snap) => {
                // console.log('Snap:', snap);
                cb(snap?.val() || { nickname: '' });
            },
            (err) => console.log('Error loading public user profile')
        );
};
export const subscribeToBalance = (uid, cb) => {
    return firebase
        .database()
        .ref(`/users-wallets/${uid}`)
        .on(
            'value',
            (snap) => {
                const val = snap?.val()?.balance;
                console.log('Loaded balance:', val);
                cb(val || 0);
            },
            (err) => console.log('Error loading user wallet')
        );
};

export const checkInitialBalance = async () => {
    try {
        const res = await firebase
            .functions()
            .httpsCallable('checkRedeemBalance')();
        console.log('checkRedeemBalance', res);
    } catch (err) {
        console.log('Error checking redeem balance', err);
    }
};

const googleSignIn = () => {
    return firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((userCred) => {
            console.log('User info after sign in:', userCred);
        })
        .catch((err) => console.log('Error signing in:', err));
};

export const signOut = () => {
    firebase.auth().signOut();
};

export const getCurrency = () => 'SPACE';
export const getPublishPrice = async () => 5;
export const isPrepublishSupported = () => true;

export const sendTip = async () => {
    throw new Error('Not implemented');
};
