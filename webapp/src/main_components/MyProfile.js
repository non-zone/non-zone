import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import {
    useAuth,
    useMyPublicProfile,
    useMyWallet,
    useLoadUserPublicProfile,
    useLoadMyBookmarks,
    useLoadStory,
} from 'nonzone-lib';
import {
    Interface,
    svg,
    // Profile,
    Slider,
    DialogWindow,
    // Image,
    CloseButton,
} from '../components';
import './myprofile.css';
import {
    updateUserProfile,
    useLoadUserStories,
    getCurrency,
} from 'nonzone-lib';
import { TakePicture } from './TakePicture';
import { Link } from 'react-router-dom';

const CURRENCY = getCurrency();

const {
    Profile: { close, save, logout },
    Slider: {
        zoner,
        explorer,
        // merchant
    },
} = svg;

const Avatar = ({ url, onChange }) => {
    return (
        <div className="myprofile_avatar">
            <TakePicture preset="avatar" onChange={onChange}>
                <img src={url} alt="avatar" />
            </TakePicture>
        </div>
    );
};

export const MyProfile = ({ onClose, onSignOut }) => {
    const { profile, loading } = useMyPublicProfile();
    const profileNotCreated = !loading && !profile?.nickname;

    const [editMode, setEditMode] = useState(false);

    if (profileNotCreated || editMode)
        return (
            <EditProfile
                onClose={() => setEditMode(false)}
                onSignOut={onSignOut}
            />
        );

    return <ZoneWallet onClose={onClose} onEdit={() => setEditMode(true)} />;
};

const EditProfile = ({ onClose, onSignOut }) => {
    const { user, loading } = useAuth();
    const { profile, loading: profileLoading } = useMyPublicProfile();
    const { balance, loading: walletLoading } = useMyWallet();

    const [state, setState] = useState({});
    const isStateDirty = !profileLoading && state !== profile;

    useEffect(() => {
        // when stored in DB, set it to state
        if (profile) setState(profile);
    }, [profile]);

    const [showCongrats, setShowCongrats] = useState(false);
    const isNewUser = useRef();

    // load all stories including unpublished
    const { data: stories } = useLoadUserStories(user?.uid, false);
    console.log('TODO list user stories:', stories);

    if (user && !profileLoading && !profile?.nickname) {
        isNewUser.current = true;
    }

    if (!user && !loading) {
        onClose();
        return <span />;
    }

    const onSave = () => {
        if (!state.nickname || !user) return;
        updateUserProfile(user.uid, state)
            .then(() => {
                if (isNewUser.current) {
                    // when new users fills details, congratulate him!
                    setShowCongrats(true);
                    isNewUser.current = false;
                } else {
                    onClose();
                }
            })
            .catch((err) => alert(err.message));
    };

    return (
        <>
            {showCongrats ? (
                <DialogWindow
                    amount={10}
                    currency={CURRENCY}
                    title="Congratulations"
                    subtitle="You’ve earned Non-Zone points"
                    text="Use your Zone Points to interact with your favorite
                    Stories, or redeem them with experience-providers in the
					area."
                    onClick={() => {
                        setShowCongrats(false);
                        onClose();
                    }}
                />
            ) : (
                ''
            )}
            {/* <Profile
                signed={!!user}
                avatarUrl={user?.photoURL}
                onClick={() => {}}
            /> */}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={
                    updateUserProfile
                        ? {
                              svg: save,
                              name: 'Update profile',
                              disabled: !isStateDirty,
                              onClick: onSave,
                          }
                        : null
                }
                rightButton={{
                    onClick: onSignOut,
                    svg: logout,
                }}
            />
            <div className="myprofile__page">
                <h1 className="myprofile__title">Profile</h1>
                <Avatar
                    url={state.photoURL || 'user.jpg'}
                    onChange={(photoURL) => setState({ ...state, photoURL })}
                />

                {isNewUser.current && (
                    <p className="myprofile__welcome">
                        Welcome to <strong>Non-zone</strong>
                        <br />
                        This is your <strong>secret place</strong>, help us to
                        make it <strong>more personal</strong> for you.
                    </p>
                )}
                {!walletLoading && !isNewUser.current && (
                    <p className="myprofile__welcome">
                        <strong>{balance}</strong> {CURRENCY}
                    </p>
                )}

                <input
                    disabled={!updateUserProfile}
                    className="myprofile__nickname"
                    type="text"
                    value={state.nickname || ''}
                    placeholder="Your nickname"
                    onChange={(e) => {
                        console.log('Input nickname', e, e.target.value);
                        // setNicknameInput(e.target.value);
                        setState({ ...state, nickname: e.target.value });
                    }}
                ></input>
                <p className="myprofile__welcome">
                    How do you see yourself the most?
                </p>
                <Slider
                    onChange={(type) => setState({ ...state, type })}
                    activeElement={state.type || 'Zoner'}
                    elements={[
                        [
                            'Zoner',
                            'Create, pin and own new Stories',
                            'Zoner',
                            zoner,
                        ],
                        // [
                        //     'Merchant',
                        //     'Provide unique experiences to explorers',
                        //     'Merchant',
                        //     merchant,
                        // ],
                        [
                            'Explorer',
                            'Interact and discover exciting Stories',
                            'Explorer',
                            explorer,
                        ],
                    ]}
                />
            </div>
        </>
    );
};

const StoryPreview = ({
    className,
    story: storyArg,
    storyId,
    showAuthor = false,
}) => {
    const { data: storyData } = useLoadStory(storyId);
    const story = storyArg || storyData;

    const { data: author } = useLoadUserPublicProfile(
        showAuthor ? story?.uid : null
    );

    if (!story) {
        return (
            <div className={cx('storypreview', className)}>
                <div className="storypreview__placeholder" />
            </div>
        );
    }
    return (
        <Link to={`/nonzone/${story.id}`}>
            <div className={cx('storypreview', className)}>
                <img
                    src={story.image_thumbnail || story.image}
                    alt="snapshot"
                />
                <div className="storypreview__title">{story.title}</div>
                <div className="storypreview__subtitle">
                    {showAuthor && author?.nickname}
                </div>
            </div>
        </Link>
    );
};

const Collection = ({ children }) => {
    return <div className="collection">{children}</div>;
};

const MyBookmarks = () => {
    const { data: bookmarks } = useLoadMyBookmarks();
    console.log('bookmarks', bookmarks);

    return (
        <div>
            {!!bookmarks?.length && (
                <>
                    <h2>My Bookmarks</h2>
                    <Collection>
                        {bookmarks.map((bm) => (
                            <StoryPreview
                                className="dark-back"
                                storyId={bm.objectId}
                                key={bm.objectId}
                                showAuthor
                            />
                        ))}
                    </Collection>
                </>
            )}
        </div>
    );
};

const MyStories = () => {
    const { user } = useAuth();
    const { data: stories } = useLoadUserStories(user?.uid);
    console.log('my stories', stories);

    return (
        <div>
            {!!stories?.length && (
                <>
                    <h2>My Stories</h2>
                    <Collection>
                        {stories.map((st) => (
                            <StoryPreview
                                className="teal-back"
                                story={st}
                                key={st.id}
                                // showAuthor
                            />
                        ))}
                    </Collection>
                </>
            )}
        </div>
    );
};

const type2icon = (type) => {
    switch (type) {
        case 'Explorer':
            return svg.Slider.explorer;
        case 'Zoner':
        default:
            return svg.Slider.zoner;
    }
};
const UserTypeWidget = ({ type }) => {
    return (
        <div className="usertype__widget">
            {type2icon(type)} {type}
        </div>
    );
};

const UserProfileDetails = ({ onEdit }) => {
    const { profile } = useMyPublicProfile();

    if (!profile) return <div className="userprofile_details" />;

    return (
        <div className="userprofile_details">
            <Avatar url={profile.photoURL || 'user.jpg'} onChange={() => {}} />
            <div>
                <div className="userprofile__name">{profile.nickname}</div>
                <UserTypeWidget type={profile.type} />
            </div>
            <div className="link" onClick={onEdit}>
                Edit profile
            </div>
        </div>
    );
};

const BalanceInfo = () => {
    const { balance } = useMyWallet();

    return (
        <div className="balance-info">
            Your balance is {balance} {CURRENCY}
        </div>
    );
};
export const ZoneWallet = ({ onClose, onEdit }) => {
    return (
        <div className="zonewallet__page">
            <CloseButton onClick={onClose} />
            <h1>Zone Wallet</h1>
            <div className="centered">
                <UserProfileDetails onEdit={onEdit} />
            </div>
            <div className="centered">
                <BalanceInfo />
            </div>
            <MyBookmarks />
            <MyStories />
        </div>
    );
};
