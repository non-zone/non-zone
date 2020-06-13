import React from 'react';
import { useAuth } from '../Auth';
import { Interface, svg } from '../components';

export const Profile = ({ onClose }) => {
  const {
    Profile: { close, save, logout },
  } = svg;
  return (
    <Interface
      leftButton={{ onClick: onClose, svg: close }}
      centralButton={{
        svg: save,
        name: 'Update profile',
        onClick: () => alert('it works'),
      }}
      rightButton={{ onClick: () => alert('you logged out'), svg: logout }}
    />
  );
};
