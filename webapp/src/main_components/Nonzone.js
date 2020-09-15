import React, { useState } from 'react';
import { Interface, svg, Sliderr, Spinner, DialogWindow } from '../components';
import './nonzone.css';
import { useParams } from 'react-router-dom';
import { useLoadStory, sendTip, getCurrency, Login } from 'nonzone-lib';
import { useAuth, useUserWallet } from 'nonzone-lib';

const TIP_AMOUNT = 0.01;
const MIN_FUNDS_FOR_TIP = TIP_AMOUNT + 0.00000001;

export const Nonzone = ({ onClose }) => {
    const { objectId } = useParams();
    console.log('Nonzoneid:', objectId);
    const { error, loading, data: object } = useLoadStory(objectId);
    const { user } = useAuth();
    const { balance } = useUserWallet(user?.uid);

    const [tipState, setTipState] = useState('');
    const enoughFundsForTip = !!balance && balance >= MIN_FUNDS_FOR_TIP;

    const onConfirmSendTip = async () => {
        try {
            setTipState('pending');
            await sendTip(object.contractId, TIP_AMOUNT, object.id);
            setTipState('success');
        } catch (err) {
            alert(err.toString());
            setTipState('ask');
        }
    };

    const {
        Nonzone: {
            // star,
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
                // centralButton={
                //     object?.contractId
                //         ? {
                //               onClick: () => setTipState('ask'),
                //               svg: tip,
                //               name: 'Send tip',
                //           }
                //         : null
                // }
                rightButton={
                    object?.contractId
                        ? {
                              onClick: () => setTipState('ask'),
                              svg: tip,
                              title: 'Send a tip',
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
