import axios from 'axios';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/functions';

const {
    REACT_APP_OCM_HOST: HOST = 'https://communitymap.online',
    REACT_APP_OCM_TOKEN: TOKEN,
} = process.env;

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
export const addNewObject = async ({
    kind,
    type,
    loc,
    uid,
    title,
    description,
    image = null,
}) => {
    if (!uid) throw new Error('uid empty');
    const timestamp = new Date().toISOString();
    const objRef = await firebase.database().ref(`/objects/`).push();

    const uri = `${HOST}/api/v0/object/?token=${TOKEN}`;
    const data = {
        type: kind,
        loc,
        title,
        description,
        logoURL: image,
        external_data: { type, image, uid, id: objRef.key },
        valid_until: '2100-01-01', //temp
    };

    console.debug('Add new object', uri, JSON.stringify(data));

    const res = await axios.post(uri, data);
    console.debug('Result:', res.data);
    return objRef.set({
        uid,
        type: kind,
        loc,
        title,
        description: description || '',
        image,
        timestamp,
        ocm_id: res.data.id,
    });
};

export const updateUserProfile = (uid, data) => {
    if (!uid) throw new Error('uid empty');
    return firebase.database().ref(`/users-public/${uid}`).update(data);
};
