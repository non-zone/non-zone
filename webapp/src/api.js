import { useState, useEffect } from 'react';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';

const {
    REACT_APP_NONZONE_ENV = 'development',
    REACT_APP_OCM_HOST,
    REACT_APP_OCM_TOKEN: TOKEN,
} = process.env;

const HOST =
    REACT_APP_OCM_HOST ||
    (REACT_APP_NONZONE_ENV === 'production'
        ? 'https://communitymap.online'
        : 'https://community-map-dev.web.app');

console.log({ HOST, TOKEN });

/**
 * Creates new object in OCM DB
 *
 * @param {props} object Props of create map object
 *
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

const postToOCM = async (data) => {
    const uri = `${HOST}/api/v0/object/?token=${TOKEN}`;
    const {
        id,
        kind,
        type,
        loc,
        uid,
        title = '',
        description = '',
        image = null,
    } = data;

    const requestBody = {
        type: kind,
        loc,
        title,
        description,
        logoURL: image,
        image,
        external_data: { type, image, uid, id },
        valid_until: '2100-01-01', //temp
    };

    console.debug('Post object to OCM', uri, JSON.stringify(requestBody));

    const res = await axios.post(uri, requestBody);
    console.debug('Result:', res.data);
    return res.data.id;
};

export const publishObject = async (data) => {
    if (data.ocm_id) throw new Error('Cannot modify published object yet');

    const ocm_id = await postToOCM(data);

    return firebase.database().ref(`/objects/`).child(data.id).update({
        ocm_id,
        published: true,
    });
};

export const useLoadStory = (id) => {
    console.log('useLoadStory', id);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!id) return;

        const unsub = firebase
            .database()
            .ref(`/objects/`)
            .child(id)
            .on(
                'value',
                (snap) => {
                    if (snap && snap.val()) {
                        setData({ ...snap.val(), id: snap.key });
                    } else {
                        setData(null);
                    }
                },
                (err) => {
                    console.log(err);
                    setError(err.message);
                }
            );
        return unsub;
    }, [id]);
    return { data, error, loading: data === undefined };
};

export const useLoadUserStories = (uid, publishedOnly = true) => {
    console.debug('useLoadUserStories', uid);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!uid) return;

        const unsub = firebase
            .database()
            .ref(`/objects/`)
            .orderByChild('uid')
            .equalTo(uid)
            .on(
                'value',
                (snap) => {
                    if (snap && snap.val()) {
                        const obj = snap.val();
                        console.debug('Loaded user stories', obj);
                        const arr = Object.entries(obj)
                            .map(([id, data]) => ({
                                id,
                                ...data,
                            }))
                            .filter(
                                (story) => !publishedOnly || !!story.published
                            );
                        console.debug('Loaded user stories arr', arr);

                        setData(arr);
                    } else {
                        setData([]);
                    }
                },
                (err) => {
                    console.log(err);
                    setError(err.message);
                }
            );
        return unsub;
    }, [uid, publishedOnly]);
    return { data, error, loading: data === undefined };
};

export const updateUserProfile = (uid, data) => {
    if (!uid) throw new Error('uid empty');
    return firebase.database().ref(`/users-public/${uid}`).update(data);
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
