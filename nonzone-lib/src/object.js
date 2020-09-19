import { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth';
import io from './io';

const DEBUG = false;

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

export const useLoadUserPublicProfile = (uid) => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!uid) return;
        return io.subscribeToProfile(uid, setData, setError);
    }, [uid]);
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

const expandRegion = (bounds) => {
    const { minLat, minLng, maxLat, maxLng } = bounds;
    const diffLat = maxLat - minLat;
    const diffLng = maxLng - minLng;
    return {
        minLat: minLat - diffLat,
        minLng: minLng - diffLng,
        maxLat: maxLat + diffLat,
        maxLng: maxLng + diffLng,
    };
};

export const useLoadStoriesByRegion = (bounds) => {
    console.debug('useLoadStoriesByRegion', bounds);
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!bounds || !bounds.maxLat) return;

        const expRegion = expandRegion(bounds);

        return io.subscribeToObjectsByRegion(
            expRegion,
            (arr) => {
                // console.log('Loaded stories', arr);
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

export const useLoadMyBookmarks = () => {
    const { user } = useAuth();

    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!user) return;

        return io.subcribeToUserBookmarks(
            user.uid,
            (arr) => {
                // console.log('Loaded stories', arr);
                setData(arr);
            },
            (err) => {
                console.log(err);
                setError(err.message);
            }
        );
    }, [user]);
    return { data, error, loading: data === undefined };
};

export const useLoadMyTips = () => {
    const { user } = useAuth();

    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        if (!user) return;

        return io.subscribeToMyTips(
            user.uid,
            (data) => {
                setData(data);
            },
            (err) => {
                console.log(err);
                setError(err.message);
            }
        );
    }, [user]);
    return { data, error, loading: data === undefined };
};

export const useLoadAdditionalInfoForObjects = (objectsIds) => {
    const [state, setState] = useState();

    const refLoaders = useRef({});

    const idsStr = objectsIds.join();
    DEBUG &&
        console.log('useLoadAdditionalInfoForObjects', {
            objectsIds,
            idsStr,
            refLoaders,
        });

    useEffect(() => {
        const loaders = refLoaders.current;
        const fireWhenReady = () => {
            DEBUG && console.log('fireWhenReady', JSON.stringify(loaders));
            const newState = {};
            for (const id in loaders) {
                const data = loaders[id].data;
                if (data === undefined) return;
                newState[id] = data;
            }
            DEBUG &&
                console.log('fireWhenReady - ready', JSON.stringify(newState));
            setState(newState);
        };

        const loadersToStop = { ...loaders };
        for (const id of objectsIds) {
            if (loaders[id]) {
                delete loadersToStop[id];
                continue;
            }
            loaders[id] = {
                data: undefined,
            };
            // it's important to save loaders[id] before calling subscribeToObjectAdditionalData
            // sometimes when data is already loaded in firebase it fires callback right away and loaders[id] must exist
            loaders[id].unsub = io.subscribeToObjectAdditionalData(
                id,
                (data) => {
                    DEBUG && console.log('Data for obj', id, data);
                    if (loaders[id]) loaders[id].data = data;
                    fireWhenReady();
                },
                (err) => {
                    console.log('Err for', id, err);
                    loaders[id] = null;
                    fireWhenReady();
                }
            );
        }
        for (const id in loadersToStop) {
            loadersToStop[id].unsub();
        }

        return () => {
            for (const id in refLoaders.current) {
                refLoaders.current[id].unsub();
            }
        };
    }, [idsStr]);

    return { data: state };
};
