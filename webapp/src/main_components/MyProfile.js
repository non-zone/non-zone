import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, signout, useUserPublicProfile } from '../Auth';
import { Interface, svg, Profile, Slider } from '../components';
import './myprofile.css';
import { updateUserProfile } from '../api';

export const MyProfile = ({ onClose }) => {
    const router = useHistory();
    const [input, setInput] = useState();
    const {
        Profile: { close, save, logout },
        Slider: { zoner, explorer, merchant },
    } = svg;

    const { user, loading } = useAuth();
    const { profile, loading: profileLoading } = useUserPublicProfile(
        user?.uid
    );

    const [showCongrats, setShowCongrats] = useState(false);
    const isNewUser = useRef();

    if (user && !profileLoading && !profile?.nickname) {
        isNewUser.current = true;
    }

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

    if (showCongrats) {
        alert('Congrats');
        return (
            <div>
                CONGR{' '}
                <button
                    onClick={() => {
                        // congratulations accepted. close all
                        onClose();
                    }}
                >
                    Explore
                </button>
            </div>
        );
    }

    return (
        <>
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
                <p className="myprofile__welcome">
                    Welcome to <strong>Non-zone</strong>
                    <br />
                    This is your <strong>secret place</strong>, help us to make
                    it <strong>more personal</strong> for you.
                </p>
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
                    onChange={(a) => console.log(a)}
                    elements={[
                        [
                            'Zoner',
                            'Create, pin and own new Non-Zones',
                            '1',
                            zoner,
                        ],
                        [
                            'Merchant',
                            'Provide unique experiences to explorers',
                            '2',
                            merchant,
                        ],
                        [
                            'Explorer',
                            'Interact and discover exciting Non-zones',
                            '3',
                            explorer,
                        ],
                    ]}
                />
            </div>
        </>
    );
};
