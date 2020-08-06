import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';

/** *
 * kind: story|place
 * type: memory|search|story
 * loc: {latitude: number, longitude: number}
 */
const saveObject = async ({
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

const savePartialObject = async (id, data) => {
    return firebase.database().ref(`/objects/`).child(id).update(data);
};

const loadObjectById = async (id) => {
    const snap = await firebase
        .database()
        .ref(`/objects/`)
        .child(id)
        .once('value');

    return snap && snap.val() ? { ...snap.val(), id: snap.key } : null;
};

const loadObjectsByUser = async (uid, publishedOnly = true) => {
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

const saveProfile = async (uid, data) => {
    if (!uid) throw new Error('uid empty');
    return firebase.database().ref(`/users-public/${uid}`).update(data);
};

export default {
    saveObject,
    savePartialObject,
    loadObjectById,
    loadObjectsByUser,
    saveProfile,
};
