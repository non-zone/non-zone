import React from 'react';
import { useAuth } from 'nonzone-lib';
import { Profile } from '../components';

export const ProfileWidget = ({ onShowProfile, onSignIn }) => {
    const { user, loading } = useAuth();

    if (loading) return <span />;

    return (
        <Profile
            signed={!!user}
            avatarUrl={user?.photoURL}
            // onClick={() => (user ? onShowProfile() : onSignIn())}
            onClick={() => (user ? undefined : onSignIn())}
            choices={[{ text: 'Profile', onClick: () => onShowProfile() }]}
        />
    );
};
