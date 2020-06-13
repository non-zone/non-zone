import React from 'react';
import { svg } from '../svg/svg';
import './profile.css';

/**
 * Profile represent Sign in button which became a profile button after authorisation
 *
 * @param {props} props - includes:
 * @param {string} avatarUrl - link to a user profile image
 * @param {boolean} signed - status of user: signed in or not
 */

export const Profile = (props) => {
  const {
    avatarUrl = '',
    signed,
    onClick = () => alert('Set a handler'),
  } = props;
  const {
    Profile: { sign },
  } = svg;

  return (
    <div className="profile" onClick={onClick}>
      {signed || avatarUrl ? (
        <div
          className="profile__avatar"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        ></div>
      ) : (
        sign
      )}
    </div>
  );
};
