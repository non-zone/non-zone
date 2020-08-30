import React from 'react';
import { svg } from '../svg/svg';
import './profile.css';

const {
    Profile: { sign },
} = svg;

/**
 * Profile represent Sign in button which became a profile button after authorisation
 *
 * @param {props} props - includes:
 * @param {string} avatarUrl - link to a user profile image
 * @param {boolean} signed - status of user: signed in or not
 */
export const Profile = ({ avatarUrl, signed, onClick }) => {
    const image = avatarUrl || '/user.png';

    return (
        <div className="profile" onClick={onClick}>
            {signed ? (
                <div
                    className="profile__avatar"
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundColor: 'white',
                    }}
                ></div>
            ) : (
                sign
            )}
        </div>
    );
};
