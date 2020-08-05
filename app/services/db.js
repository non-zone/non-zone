import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

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

// TODO add map bounds
export const useLoadStories = (publishedOnly = true) => {
    console.debug('useLoadUserStories');
    const [data, setData] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        const unsub = firebase
            .database()
            .ref(`/objects/`)
            // .orderByChild('uid')
            // .equalTo(uid)
            .on(
                'value',
                (snap) => {
                    if (snap && snap.val()) {
                        const obj = snap.val();
                        console.debug('Loaded  stories', obj);
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
    }, []);
    return { data, error, loading: data === undefined };
};

// const DataContext = React.createContext()

// export const DataProvider
