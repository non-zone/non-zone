import axios from 'axios';
import { initFirebase as initOcmFirebase } from '@opencommunitymap/react-sdk';

const {
    NONZONE_ENV = 'development',
    REACT_APP_OCM_HOST,
    REACT_APP_OCM_TOKEN: TOKEN,
} = process.env;

const HOST =
    REACT_APP_OCM_HOST ||
    (NONZONE_ENV === 'production'
        ? 'https://communitymap.online'
        : 'https://community-map-dev.web.app');

console.log({ HOST, TOKEN });
initOcmFirebase(NONZONE_ENV);

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

export default {
    publish,
};
