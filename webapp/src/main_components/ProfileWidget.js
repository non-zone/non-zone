import React from 'react';
import { useAuth, useUserPublicProfile } from 'nonzone-lib';
import { Profile } from '../components';

export const ProfileWidget = ({ onShowProfile, onSignIn }) => {
    const { user, loading } = useAuth();
    const { profile, loading: profileLoading } = useUserPublicProfile(
        user?.uid
    );

    if (loading || profileLoading) return <span />;

    return (
        <Profile
            signed={!!user}
            avatarUrl={profile?.photoURL || user?.photoURL || 'user.jpg'}
            onClick={() => (user ? onShowProfile() : onSignIn())}
        />
    );
};
