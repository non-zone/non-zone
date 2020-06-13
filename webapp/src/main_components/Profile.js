import React from 'react';
import { useAuth } from '../Auth';
import { Interface, svg, Profile } from '../components';

export const MyProfile = ({ onClose }) => {
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
        rightButton={{ onClick: () => alert('you logged out'), svg: logout }}
      />
	  <h1 className="my">Profile</h1>
    </>
  );
};
