import React, { useState } from 'react';
import { Interface, svg, Sliderr, Spinner, DialogWindow } from '../components';
import './nonzone.css';
import { useParams } from 'react-router-dom';
import {
    useLoadStory,
    sendTip,
    useLoadMyTips,
    getCurrency,
    Login,
    setBookmarkObject,
    clearBookmarkObject,
    useLoadMyBookmarks,
} from 'nonzone-lib';
import { useAuth, useUserWallet } from 'nonzone-lib';

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

export const Nonzone = ({ onClose }) => {
    const { objectId } = useParams();
    console.log('Nonzoneid:', objectId);
    const { error, loading, data: object } = useLoadStory(objectId);
    const { user } = useAuth();
    const { balance } = useUserWallet(user?.uid);

    const { data: bookmarks } = useLoadMyBookmarks();
    const isBookmarked = bookmarks?.some((b) => b.objectId === objectId);

    const { data: myTips } = useLoadMyTips();
    const storyTips = myTips?.[objectId];
    const hasTipped = !!storyTips;
    const tipsCount = hasTipped ? Object.keys(storyTips).length : 0;
    console.log({ myTips, storyTips, hasTipped });

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
                    object?.contractId || object?.uid
                        ? {
                              onClick: () => setTipState('ask'),
                              svg: tip,
                              title: 'Send a tip',
                              badge: hasTipped ? (
                                  <>
                                      {Array(tipsCount)
                                          .fill(0)
                                          .map((_, i) => (
                                              <TipBadgeIcon key={i} />
                                          ))}
                                  </>
                              ) : undefined,
                          }
                        : null
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
                        <div className="nonzone__bottom"></div>
                    </div>
                </div>
            )}
        </>
    );
};
