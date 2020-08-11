import { useState, useEffect } from 'react';
// import ocm from './integrations/ocm';
// import io from './integrations/firebase';
import io from './integrations/arweave';

export const saveObject = async (data) => {
    const id = await io.saveObject(data);
    return id;
};

export const publishObject = async (data) => {
    if (data.published) throw new Error('Cannot modify published object yet');

    // const ocm_id = await ocm.publish(data);

    await io.savePartialObject(data.id, {
        // ocm_id,
        published: true,
    });
};

export const useLoadStory = (id) => {
    console.log('useLoadStory', id);
    const [data, setData] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (!id) return;

        io.loadObjectById(id)
            .then((obj) => {
                console.log('Loaded story', obj);
                setData(obj);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
            });
    }, [id]);
    return { data, error, loading: data === undefined };
};

export const useLoadUserStories = (uid, publishedOnly = true) => {
    console.debug('useLoadUserStories', uid);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!uid) return;
        (async () => {
            try {
                const arr = await io.loadObjectsByUser(uid, publishedOnly);
                console.log('Loaded stories', arr);
                setData(arr);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        })();
    }, [uid, publishedOnly]);
    return { data, error, loading: data === undefined };
};

export const useLoadStoriesByRegion = (bounds) => {
    console.debug('useLoadStoriesByRegion', bounds);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!bounds || !bounds.maxLat) return;
        (async () => {
            try {
                const arr = await io.loadObjectsByRegion(bounds);
                console.log('Loaded stories', arr);
                setData(arr);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        })();
    }, [bounds]);
    return { data, error, loading: data === undefined };
};

export const updateUserProfile = async (uid, data) => {
    return io.saveProfile(uid, data);
};

export const subscribeToUserService = (cb) => {
    return io.subscribeToUserService(cb);
};

export const signOut = () => io.signOut();

export const getCurrency = () => io.getCurrency();
export const getPublishPrice = async (data) => io.getPublishPrice(data);
export const isPrepublishSupported = () => io.isPrepublishSupported();

export const sendTip = (contractId, amount, refId) =>
    io.sendTip(contractId, amount, refId);
