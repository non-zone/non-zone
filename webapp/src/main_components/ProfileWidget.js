import React from 'react';
import { useAuth } from '../Auth';
import { Profile } from '../components';

export const ProfileWidget = ({ onShowProfile, onSignIn }) => {
    const { user, loading } = useAuth();

    if (loading) return <span />;

    return (
        <Profile
            signed={!!user}
            avatarUrl={user?.photoURL}
            onClick={() => (user ? onShowProfile() : onSignIn())}
        />
    );
};
