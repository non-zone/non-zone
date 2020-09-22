import React, { useState } from 'react';
import { Interface, svg, Sliderr, Spinner, DialogWindow } from '../components';
import './nonzone.css';
import { useParams } from 'react-router-dom';
import {
    useLoadStory,
    sendTip,
    likeObject,
    leaveComment,
    useLoadAdditionalInfoForObjects,
    getCurrency,
    Login,
    setBookmarkObject,
    clearBookmarkObject,
    useLoadMyBookmarks,
    useLoadUserPublicProfile,
} from 'nonzone-lib';
import { useAuth, useMyWallet } from 'nonzone-lib';

const TIP_AMOUNT = getCurrency() === 'SPACE' ? 1 : 0.01;
const MIN_FUNDS_FOR_TIP = TIP_AMOUNT + 0.00000001;

const tipBadgeStyle = {
    backgroundColor: 'gold',
    borderRadius: '50%',
    display: 'inline-block',
    height: 7,
    width: 7,
};
const TipBadgeIcon = () => <div style={tipBadgeStyle} />;

const Comment = ({ value }) => {
    const { ts, uid, comment } = value;
    const { data: profile } = useLoadUserPublicProfile(uid);
    return (
        <div>
            {new Date(ts).toLocaleString()} - {profile?.nickname || ''}
            <div>{comment}</div>
        </div>
    );
};

const CommentForm = ({ onSubmit }) => {
    const [state, setState] = useState('');
    const [submitPending, setSubmitPending] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        const comment = state.trim();
        if (!comment) return;
        setSubmitPending(true);
        try {
            await onSubmit(comment);
            setState('');
        } finally {
            setSubmitPending(false);
        }
    };
    return (
        <form onSubmit={submit}>
            {submitPending && <Spinner />}
            <textarea
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={`This costs ${TIP_AMOUNT} ${getCurrency()}`}
            />
            <br />
            <button>Post</button>
        </form>
    );
};

export const Nonzone = ({ onClose }) => {
    const { objectId } = useParams();
    console.log('Nonzoneid:', objectId);
    const { error, loading, data: object } = useLoadStory(objectId);
    const { user } = useAuth();
    const { balance } = useMyWallet();

    const { data: bookmarks } = useLoadMyBookmarks();
    const isBookmarked = bookmarks?.some((b) => b.objectId === objectId);

    const { data: additonalDataArr } = useLoadAdditionalInfoForObjects([
        objectId,
    ]);
    const additonalData = additonalDataArr?.[objectId];
    const storyTips = Object.values(additonalData?.tips || {});
    const myTipsCount = storyTips.filter((t) => t.uid === user?.uid).length;

    const storyLikes = Object.values(additonalData?.likes || {});
    const _isLikedDB = storyLikes.some((t) => t.uid === user?.uid);
    const [_isLikedState, setIsLiked] = useState(false);
    const isLikedByMe = _isLikedDB || _isLikedState;

    const comments = Object.values(additonalData?.comments || []);

    console.log({
        myTipsCount,
        storyTips,
        storyLikes,
        isLikedByMe,
        _isLikedDB,
        _isLikedState,
    });

    const [tipState, setTipState] = useState('');
    const enoughFundsForTip = !!balance && balance >= MIN_FUNDS_FOR_TIP;

    const onConfirmSendTip = async () => {
        try {
            setTipState('pending');
            await sendTip(
                object.contractId || object?.uid,
                TIP_AMOUNT,
                object.id
            );
            setTipState('success');
        } catch (err) {
            alert(err.toString());
            setTipState('ask');
        }
    };
    const onLike = async () => {
        setIsLiked(true);
        try {
            await likeObject(object.id);
        } catch (err) {
            console.log(err.toString());
        }
    };

    const onLeaveComment = async (comment) => {
        try {
            await leaveComment(object.id, comment);
        } catch (err) {
            alert(err.toString());
        }
    };

    const {
        Nonzone: {
            star,
            starGold,
            // flag,
            close,
            tip,
        },
    } = svg;
    return (
        <>
            {error && <div>{error.toString()}</div>}
            {(loading || tipState === 'pending') && <Spinner />}
            {tipState === 'success' && (
                <DialogWindow
                    title="Congratulations!"
                    text="Your tip is successfully sent."
                    onClick={() => setTipState(null)}
                />
            )}
            {tipState === 'ask' && !user && (
                <Login onCancel={() => setTipState(null)} />
            )}
            {tipState === 'ask' && !!user && !enoughFundsForTip && (
                <DialogWindow
                    title="Insufficient balance :("
                    text={`You need to have at least ${MIN_FUNDS_FOR_TIP} ${getCurrency()}`}
                    onClick={() => setTipState(null)}
                />
            )}
            {tipState === 'ask' && !!user && enoughFundsForTip && (
                <DialogWindow
                    amount={TIP_AMOUNT}
                    currency={getCurrency()}
                    title="You're sending tip to the author"
                    action="Yes, I want to proceed!"
                    secondaryAction="Cancel"
                    onClick={onConfirmSendTip}
                    onClickSecondary={() => setTipState(null)}
                />
            )}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={
                    !!user && !object?.contractId // temp
                        ? {
                              onClick: () =>
                                  !isBookmarked
                                      ? setBookmarkObject(
                                            user.uid,
                                            objectId,
                                            object?.title
                                        )
                                      : clearBookmarkObject(user.uid, objectId),
                              svg: isBookmarked ? starGold : star,
                              name: 'Bookmark',
                          }
                        : null
                }
                rightButton={
                    (object?.contractId || object?.uid) &&
                    object?.uid !== user?.uid
                        ? {
                              onClick: () => setTipState('ask'),
                              svg: tip,
                              title: 'Send a tip',
                              badge: myTipsCount ? (
                                  <>
                                      {Array(myTipsCount)
                                          .fill(0)
                                          .map((_, i) => (
                                              <TipBadgeIcon key={i} />
                                          ))}
                                  </>
                              ) : undefined,
                          }
                        : {}
                }
            />
            {!!object && (
                <div className="nonzone__wrapper ">
                    <div className="nonzone__page">
                        {/* <div
                        className="nonzone__image"
                        style={{
                            backgroundImage: `url(${object?.logoURL})`,
                        }}
                    ></div> */}
                        {!!object?.image && (
                            <div className="nonzone__image_holder">
                                <img
                                    alt="snapshot"
                                    className="nonzone__image"
                                    src={object?.image}
                                />
                            </div>
                        )}
                        <p className="nonzone__type">{object?.title}</p>
                        <p className="nonzone__author"></p>
                        <p className="nonzone__text">{object?.description}</p>
                        <p className="nonzone__type">Story type</p>
                        <Sliderr
                            onChange={(a) => console.log(a)}
                            elements={[['#' + object?.kind]]}
                        />
                        <div className="nonzone__bottom">
                            {!!storyTips.length && (
                                <div className="likes-info">
                                    {storyTips.length}{' '}
                                    {storyTips.length === 1 ? 'tip' : 'tips'}
                                </div>
                            )}
                            {isLikedByMe ? (
                                <div className="likes-info">Liked</div>
                            ) : (
                                <button onClick={onLike}>Like</button>
                            )}
                            {comments.length > 0 && (
                                <div className="likes-info">
                                    <h3>Comments</h3>
                                    {comments.map((c, idx) => (
                                        <Comment key={idx} value={c} />
                                    ))}
                                </div>
                            )}
                            <CommentForm onSubmit={onLeaveComment} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
