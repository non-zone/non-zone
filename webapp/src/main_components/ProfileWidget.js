import React from 'react';
import 'firebase/auth';
import { useAuth, googleSignIn } from '../Auth';
import { Profile } from '../components';

export const ProfileWidget = ({ onShowProfile }) => {
    const { user, loading } = useAuth();

    if (loading) return <span />;

    return (
        <Profile
            avatarUrl={user?.photoURL}
            onClick={() => (user ? onShowProfile() : googleSignIn())}
        />
    );
};
