import React from 'react';
import './tippingdialog.css';

/**
 * TippingDialog - represents all types of tips and messages in ainterface
 *
 * @param {Function} onTip - tip handler
 * @param {Function} onCancel - cancel handler
 */

export const TippingDialog = ({ onTip, onCancel }) => {
    return (
        <div className="tippingwindow">
            <div className="tippingwindow__box tippingwindow-animation ">
                <h1 className="tippingwindow__title">Thanks!</h1>

                <p className="tippingwindow__text">
                    Now, traveling may be tiring, would you like to offer a
                    coffee to the author?
                </p>
                <div className="tippingwindow__tipbox">
                    <div
                        className="tippingwindow__tipbutton"
                        onClick={() => onTip(1)}
                    >
                        <p>1</p>
                    </div>
                    <div
                        className="tippingwindow__tipbutton"
                        onClick={() => onTip(3)}
                    >
                        <p>3</p>
                    </div>
                    <div
                        className="tippingwindow__tipbutton"
                        onClick={() => onTip(5)}
                    >
                        <p>5</p>
                    </div>
                </div>
            </div>
            {!!onCancel && (
                <button
                    onClick={onCancel}
                    className="tippingwindow__button tippingwindow-animation secondary "
                >
                    Cancel
                </button>
            )}
        </div>
    );
};
