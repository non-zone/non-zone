import { useState, useEffect } from 'react';
import fb from './integrations/firebase';
import arweave from './integrations/arweave';
import ocm from './integrations/ocm';

// const io = fb;
const io = arweave;

// temp, force update in hooks
let tick = 0;

export const saveObject = async (data) => {
    const id = await io.saveObject(data);
    ++tick;
    return id;
};

export const publishObject = async (data) => {
    if (data.ocm_id) throw new Error('Cannot modify published object yet');

    const ocm_id = await ocm.publish(data);

    await io.savePartialObject(data.id, {
        ocm_id,
        published: true,
    });
    ++tick;
};

export const useLoadStory = (id) => {
    console.log('useLoadStory', id);
    const [data, setData] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (!id) return;

        io.loadObjectById(id)
            .then((obj) => {
                console.log('Loaded story', obj, tick);
                setData(obj);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
            });
    }, [id, tick]);
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
                console.log('Loaded stories', arr, tick);
                setData(arr);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        })();
    }, [uid, publishedOnly, tick]);
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
                console.log('Loaded stories', arr, tick);
                setData(arr);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        })();
    }, [bounds, tick]);
    return { data, error, loading: data === undefined };
};

export const updateUserProfile = async (uid, data) => {
    return io.saveProfile(uid, data);
};
