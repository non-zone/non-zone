import { useState, useEffect } from 'react';
import io from './io';

export const saveObject = async (data) => {
    const id = await io.saveObject(data);
    return id;
};

export const publishObject = async (data) => {
    if (data.published) throw new Error('Cannot modify published object yet');

    // const ocm_id = await ocm.publish(data);

    await io.publishObject(data);
    //  {
    //     // ocm_id,
    //     published: true,
    // });
};

export const useLoadStory = (id) => {
    console.log('useLoadStory', id);
    const [data, setData] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (!id) return;

        return io.subscribeToObjectById(
            id,
            (obj) => {
                console.log('Loaded story', obj);
                setData(obj);
            },
            (err) => {
                console.log(err);
                setError(err.message);
            }
        );
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

        return io.subscribeToObjectsByRegion(
            bounds,
            (arr) => {
                console.log('Loaded stories', arr);
                setData(arr);
            },
            (err) => {
                console.log(err);
                setError(err.message);
            }
        );
    }, [bounds]);
    return { data, error, loading: data === undefined };
};

export const useLoadMyBookmarks = () => {};
