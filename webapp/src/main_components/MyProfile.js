import React, { useState } from 'react';
import { useAuth } from '../Auth';
import { Interface, svg, Profile, Slider } from '../components';
import './myprofile.css';

export const MyProfile = ({ onClose }) => {
    const [input, setInput] = useState('Your nickname');
    const {
        Profile: { close, save, logout },
    } = svg;
    return (
        <>
            <Profile
                avatarUrl={
                    'https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA'
                }
            />
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: save,
                    name: 'Update profile',
                    onClick: () => alert('it works'),
                }}
                rightButton={{
                    onClick: () => alert('you logged out'),
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <p className="myprofile__welcome">
                    How do you see yourself the most?
                </p>
                <Slider
                    onChange={(a) => alert(a)}
                    elements={[
                        ['Zoner', 'Description', '1'],
                        ['Merchant', 'Description', '2'],
                        ['Explorer', 'Description', '3'],
                    ]}
                />
            </div>
        </>
    );
};
