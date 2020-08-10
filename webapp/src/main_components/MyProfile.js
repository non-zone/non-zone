import React, { useState, useRef } from 'react';
import { useAuth, signout, useUserPublicProfile, useUserWallet } from '../Auth';
import {
    Interface,
    svg,
    Profile,
    Slider,
    DialogWindow,
    // Image,
} from '../components';
import './myprofile.css';
import { updateUserProfile, useLoadUserStories } from '../api';

export const MyProfile = ({ onClose }) => {
    const [input, setInput] = useState();
    const [type, setType] = useState('Zoner');
    const {
        Profile: { close, save, logout },
        Slider: { zoner, explorer, merchant },
    } = svg;

    const { user, loading } = useAuth();
    const { profile, loading: profileLoading } = useUserPublicProfile(
        user?.uid
    );
    const { balance, loading: walletLoading } = useUserWallet(user?.uid);

    const [showCongrats, setShowCongrats] = useState(false);
    const isNewUser = useRef();

    // load all stories including unpublished
    const { data: stories } = useLoadUserStories(user?.uid, false);
    console.log('TODO list user stories:', stories);

    if (user && !profileLoading && !profile?.nickname) {
        isNewUser.current = true;
    }
    // const isShowDummyImage =
    //     !!user && !!profile?.nickname && !isNewUser.current;

    if (!user && !loading) {
        onClose();
        return <span />;
    }

    const inputValue = input === undefined ? profile?.nickname : input;
    console.log(
        'input value',
        typeof input,
        typeof inputValue,
        input,
        inputValue,
        profile,
        user
    );

    const onSave = () => {
        if (!input || !user) return;
        updateUserProfile(user.uid, { nickname: inputValue })
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
    const onSignout = () => signout();

    return (
        <>
            {/* {isShowDummyImage && (
                <Image
                // onClose={onClose}
                />
            )} */}
            {showCongrats ? (
                <DialogWindow
                    amount={10}
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
            <Profile avatarUrl={user?.photoURL} onClick={() => {}} />
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: save,
                    name: 'Update profile',
                    onClick: onSave,
                }}
                rightButton={{
                    onClick: onSignout,
                    svg: logout,
                }}
            />
            <div className="myprofile__page">
                <h1 className="myprofile__title">Profile</h1>
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
                        Your balance is <strong>{balance}</strong> SPACES
                    </p>
                )}

                <input
                    className="myprofile__nickname"
                    type="text"
                    value={inputValue}
                    placeholder="Your nickname"
                    onChange={(e) => {
                        console.log('Input nickname', e, e.target.value);
                        setInput(e.target.value);
                    }}
                ></input>
                <p className="myprofile__welcome">
                    How do you see yourself the most?
                </p>
                <Slider
                    onChange={setType}
                    activeElement={type}
                    elements={[
                        [
                            'Zoner',
                            'Create, pin and own new Stories',
                            'Zoner',
                            zoner,
                        ],
                        [
                            'Merchant',
                            'Provide unique experiences to explorers',
                            'Merchant',
                            merchant,
                        ],
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
