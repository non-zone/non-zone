import React, { useState, useEffect, useRef } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    useHistory,
} from 'react-router-dom';
import './App.css';
import { CommunityMap, Pin, detectLocation } from '@opencommunitymap/react-sdk';
import mapStyles from './MapsGoogleDarkStyle.json';
import {
    NavigationWidget,
    Splash,
    ProfileWidget,
    getRenderObject,
    MyProfile,
    CreateSaveStory,
    Nonzone,
    CreateMerchant,
    EditStory,
} from './main_components';
import {
    AuthProvider,
    useAuth,
    useMyPublicProfile,
    saveObject,
    publishObject,
    useLoadStoriesByRegion,
    signOut,
    checkInitialBalance,
    Login,
    googleConfig,
    useLoadAdditionalInfoForObjects,
} from 'nonzone-lib';
import { restoreLastLocation, storeLastLocation } from './utils';

const GOOGLE_API_KEY = googleConfig.apiKey;

const defaultCenter = restoreLastLocation() || {
    latitude: 42.69,
    longitude: 23.32,
};

const isMerchantMode = window.location.search === '?create-service';

const Map = () => {
    const [center, setCenter] = useState();
    const [zoom, setZoom] = useState();
    const [bounds, setBounds] = useState();
    const [showMerchants, setShowMerchants] = useState(false);
    const router = useHistory();

    const { error, loading: loadingStories, data } = useLoadStoriesByRegion(
        bounds
    );
    console.log('LoadStoriesHook', { error, loadingStories, data });

    const { data: additionalData } = useLoadAdditionalInfoForObjects(
        data?.map((d) => d.id) || []
    );
    // console.log('Additional data', additionalData);

    useEffect(() => {
        detectLocation()
            .then((loc) => {
                console.log('Autodetect location initially', loc);
                setCenter(loc);
            })
            .catch((err) => console.log(err.message));
    }, []);

    const { user } = useAuth();
    const { profile, loading } = useMyPublicProfile();

    if (user && !loading && !profile?.nickname) {
        router.replace('/profile');
    }

    const userUid = user?.uid;
    useEffect(() => {
        if (userUid) {
            checkInitialBalance();
        }
    }, [userUid]);

    const centerRef = useRef(center);
    centerRef.current = center;

    const onSaveCallback = (kind) => async (info) => {
        const data = { loc: centerRef.current, uid: user.uid, kind, ...info };
        return saveObject(data);
    };
    const onPublish = async (info) => {
        const data = {
            loc: centerRef.current,
            uid: user.uid,
            kind: info.kind || 'story',
            ...info,
        };
        return publishObject(data);
    };

    return (
        <Switch>
            <Route path="/" exact>
                <CommunityMap
                    mapApiKey={GOOGLE_API_KEY}
                    // autolocate
                    filterOrigin="non-zone"
                    mapStyles={mapStyles}
                    centerPin={<Pin color="#79CAB5" />}
                    center={center}
                    data={data || []}
                    defaultCenter={defaultCenter}
                    zoom={zoom}
                    showZoomControls={false}
                    profileWidget={<span />}
                    renderObject={getRenderObject(
                        (objectId) => router.push(`/nonzone/${objectId}`),
                        showMerchants,
                        (objectId) => additionalData?.[objectId]?.tips || null
                    )}
                    navigationWidget={
                        <NavigationWidget
                            autolocate={() =>
                                detectLocation()
                                    .then((loc) => {
                                        console.log(
                                            'Autodetect location manually',
                                            loc
                                        );
                                        setCenter(loc);
                                    })
                                    .catch((err) => alert(err.message))
                            }
                            toggleMerchants={() => {
                                setShowMerchants((val) => !val);
                            }}
                            createZone={
                                () =>
                                    user
                                        ? router.push('/create')
                                        : router.push('/login') // googleSignIn()
                            }
                            // zoomIn={() => setZoom((zoom = 18) => zoom + 1)}
                            // zoomOut={() => setZoom((zoom = 18) => zoom - 1)}
                        >
                            <ProfileWidget
                                onShowProfile={() => router.push('/profile')}
                                onSignIn={() => {
                                    // googleSignIn()
                                    router.push('/login');
                                }}
                            />
                        </NavigationWidget>
                    }
                    onChange={(newCenter, newBounds, newZoom) => {
                        console.log({ newCenter, newBounds, newZoom });
                        if (
                            center?.latitude === newCenter.latitude &&
                            center?.longitude === newCenter.longitude &&
                            zoom === newZoom
                        ) {
                            console.log('Ignore update for same location', {
                                newCenter,
                                center,
                                zoom,
                                newZoom,
                            });
                            return; // save unneeded reload
                        }
                        setBounds(newBounds);
                        setCenter(newCenter);
                        setZoom(newZoom);
                        setTimeout(() => storeLastLocation(newCenter), 0);
                    }}
                />
            </Route>
            <Route path="/profile">
                <MyProfile
                    onClose={() => router.push('/')}
                    onSignOut={() => {
                        signOut();
                        router.push('/');
                    }}
                />
            </Route>
            <Route path="/login">
                <Login
                    onCancel={() => router.push('/')}
                    onSignedIn={() => {
                        router.push('/');
                    }}
                />
            </Route>
            <Route path="/create">
                {!isMerchantMode ? (
                    <CreateSaveStory
                        onClose={() => router.push('/')}
                        onSave={(data) =>
                            onSaveCallback('story')(data)
                                .then((storyId) =>
                                    router.push(`/edit/${storyId}`)
                                )
                                .catch((err) => {
                                    console.log('Error saving story:', err);
                                    alert(`Error saving story: ${err.message}`);
                                })
                        }
                        onPublish={onPublish}
                    />
                ) : (
                    <CreateMerchant
                        onClose={() => router.push('/')}
                        onSave={onSaveCallback('place')}
                    />
                )}
            </Route>
            <Route path="/edit/:storyId">
                <EditStory
                    onClose={() => router.push('/')}
                    onSave={onSaveCallback('story')}
                    onPublish={onPublish}
                />
            </Route>
            <Route path="/nonzone/:objectId">
                <Nonzone onClose={() => router.push('/')} />
            </Route>
        </Switch>
    );
};

function App() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div className="App">
            {loading && <Splash />}
            <Map />
        </div>
    );
}

export default () => (
    <Router>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Router>
);
