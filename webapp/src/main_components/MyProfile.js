import React, { useState } from 'react';
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
    const { profile } = useUserPublicProfile(user?.uid);

    if (!user && !loading) {
        return onClose();
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
        updateUserProfile(user.uid, { nickname: inputValue });
    };
    const onSignout = () => signout();

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
                    Welcome to Non-zone This is your secret place, help us to
                    make it more personal for you.
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
                            'Provide unique expiriences to explorers',
                            '2',
                            merchant,
                        ],
                        [
                            'Explorer',
                            'Interact and discover exiting Non-zones',
                            '3',
                            explorer,
                        ],
                    ]}
                />
            </div>
        </>
    );
};
