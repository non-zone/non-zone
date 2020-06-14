import React, { useState } from 'react';
import { useAuth } from '../Auth';
import { Interface, svg, Profile, Slider } from '../components';
import './myprofile.css';

export const MyProfile = ({ onClose }) => {
    const [input, setInput] = useState('Your nickname');
    const {
        Profile: { close, save, logout },
        Slider: { zoner, explorer, merchant },
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
                    onChange={(a) => console.log(a)}
                    elements={[
                        ['Zoner', 'Create, pin and own new Non-Zones', '1', zoner],
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
