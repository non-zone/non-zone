import React, { useMemo } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { svg } from '../svg/svg';
import './profile.css';

const {
    Profile: { sign },
} = svg;
// const options = [
//     { key: 'user', text: 'Account', icon: 'user' },
//     {
//         key: 'settings',
//         text: 'Settings',
//         icon: 'settings',
//         onClick: () => alert('gaga'),
//     },
//     { key: 'sign-out', text: 'Sign Out', icon: 'sign out' },
// ];
/**
 * Profile represent Sign in button which became a profile button after authorisation
 *
 * @param {props} props - includes:
 * @param {string} avatarUrl - link to a user profile image
 * @param {boolean} signed - status of user: signed in or not
 * @param {array} choices - menu options [{text: 'Settings', onClick}]
 */
export const Profile = ({ avatarUrl, signed, onClick, choices }) => {
    const image = avatarUrl || '/user.png';

    const options = useMemo(
        () =>
            choices?.map((choice) => ({
                ...choice,
                key: choice.text,
            })),
        [choices]
    );
    console.log('FAGA', options, choices, avatarUrl);

    if (!signed)
        return (
            <div className="profile top-right" onClick={onClick}>
                {sign}
            </div>
        );

    const profile = (
        <div className="profile">
            <div
                className="profile__avatar"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundColor: 'white',
                }}
            ></div>
        </div>
    );

    return (
        <Dropdown
            className="profile-dropdown top-right"
            trigger={profile}
            options={options}
            direction="left"
            icon={null}
        />
    );
};
