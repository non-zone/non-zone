import axios from 'axios';
import { initFirebase as initOcmFirebase } from '@opencommunitymap/react-sdk';
import { getNonzoneEnv } from '../config';

const { REACT_APP_OCM_HOST, REACT_APP_OCM_TOKEN: TOKEN } = process.env;

const HOST =
    REACT_APP_OCM_HOST ||
    (getNonzoneEnv() === 'production'
        ? 'https://communitymap.online'
        : 'https://community-map-dev.web.app');

console.log({ HOST, TOKEN });
initOcmFirebase(getNonzoneEnv());

const publish = async (data) => {
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
        type,
        loc,
        title,
        description,
        logoURL: image,
        image,
        external_data: { type, kind, image, uid, id },
        valid_until: '2100-01-01', //temp
    };

    console.debug('Post object to OCM', uri, JSON.stringify(requestBody));

    const res = await axios.post(uri, requestBody);
    console.debug('Result:', res.data);
    return res.data.id;
};

export default {
    publish,
};
