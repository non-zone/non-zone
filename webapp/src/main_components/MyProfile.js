import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useMyPublicProfile, useMyWallet } from 'nonzone-lib';
import {
    Interface,
    svg,
    // Profile,
    Slider,
    DialogWindow,
    // Image,
} from '../components';
import './myprofile.css';
import {
    updateUserProfile,
    useLoadUserStories,
    getCurrency,
} from 'nonzone-lib';
import { TakePicture } from './TakePicture';

const CURRENCY = getCurrency();

const {
    Profile: { close, save, logout },
    Slider: {
        zoner,
        explorer,
        // merchant
    },
} = svg;

const Avatar = ({ url, onChange }) => {
    return (
        <div className="myprofile_avatar">
            <TakePicture preset="avatar" onChange={onChange}>
                <img src={url} alt="avatar" />
            </TakePicture>
        </div>
    );
};

export const MyProfile = ({ onClose, onSignOut }) => {
    const { user, loading } = useAuth();
    const { profile, loading: profileLoading } = useMyPublicProfile();
    const { balance, loading: walletLoading } = useMyWallet();

    const [state, setState] = useState({});
    const isStateDirty = !profileLoading && state !== profile;

    useEffect(() => {
        // when stored in DB, set it to state
        if (profile) setState(profile);
    }, [profile]);

    const [showCongrats, setShowCongrats] = useState(false);
    const isNewUser = useRef();

    // load all stories including unpublished
    const { data: stories } = useLoadUserStories(user?.uid, false);
    console.log('TODO list user stories:', stories);

    if (user && !profileLoading && !profile?.nickname) {
        isNewUser.current = true;
    }

    if (!user && !loading) {
        onClose();
        return <span />;
    }

    const onSave = () => {
        if (!state.nickname || !user) return;
        updateUserProfile(user.uid, state)
            .then(() => {
                if (isNewUser.current) {
                    // when new users fills details, congratulate him!
                    setShowCongrats(true);
                    isNewUser.current = false;
                } else {
                    onClose();
                }
            })
            .catch((err) => alert(err.message));
    };

    return (
        <>
            {showCongrats ? (
                <DialogWindow
                    amount={10}
                    currency={CURRENCY}
                    title="Congratulations"
                    subtitle="You’ve earned Non-Zone points"
                    text="Use your Zone Points to interact with your favorite
                    Stories, or redeem them with experience-providers in the
					area."
                    onClick={() => {
                        setShowCongrats(false);
                        onClose();
                    }}
                />
            ) : (
                ''
            )}
            {/* <Profile
                signed={!!user}
                avatarUrl={user?.photoURL}
                onClick={() => {}}
            /> */}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={
                    updateUserProfile
                        ? {
                              svg: save,
                              name: 'Update profile',
                              disabled: !isStateDirty,
                              onClick: onSave,
                          }
                        : null
                }
                rightButton={{
                    onClick: onSignOut,
                    svg: logout,
                }}
            />
            <div className="myprofile__page">
                <h1 className="myprofile__title">Profile</h1>
                <Avatar
                    url={state.photoURL || 'user.jpg'}
                    onChange={(photoURL) => setState({ ...state, photoURL })}
                />

                {isNewUser.current && (
                    <p className="myprofile__welcome">
                        Welcome to <strong>Non-zone</strong>
                        <br />
                        This is your <strong>secret place</strong>, help us to
                        make it <strong>more personal</strong> for you.
                    </p>
                )}
                {!walletLoading && !isNewUser.current && (
                    <p className="myprofile__welcome">
                        <strong>{balance}</strong> {CURRENCY}
                    </p>
                )}

                <input
                    disabled={!updateUserProfile}
                    className="myprofile__nickname"
                    type="text"
                    value={state.nickname || ''}
                    placeholder="Your nickname"
                    onChange={(e) => {
                        console.log('Input nickname', e, e.target.value);
                        // setNicknameInput(e.target.value);
                        setState({ ...state, nickname: e.target.value });
                    }}
                ></input>
                <p className="myprofile__welcome">
                    How do you see yourself the most?
                </p>
                <Slider
                    onChange={(type) => setState({ ...state, type })}
                    activeElement={state.type || 'Zoner'}
                    elements={[
                        [
                            'Zoner',
                            'Create, pin and own new Stories',
                            'Zoner',
                            zoner,
                        ],
                        // [
                        //     'Merchant',
                        //     'Provide unique experiences to explorers',
                        //     'Merchant',
                        //     merchant,
                        // ],
                        [
                            'Explorer',
                            'Interact and discover exciting Stories',
                            'Explorer',
                            explorer,
                        ],
                    ]}
                />
            </div>
        </>
    );
};
