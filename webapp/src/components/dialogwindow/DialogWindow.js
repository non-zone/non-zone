import React from 'react';
import './dialogwindow.css';

/**
 * Dialogwindow - represents all types of tips and messages in ainterface
 *
 * @param {props} props
 * @param {number} amount - amount of coins which user has earned // put this props to display special type of this window
 * @param {Function} onClose - closing hanlder
 * @param {Function} onClick - additional functional
 * @param {string} title - title for this window
 */

export const DialogWindow = (props) => {
    const {
        amount = '',
        onClose = () => alert('this is handler'),
        onClick = () => alert('onClose'),
        text = '',
        title = "Warning",
    } = props;
    const onClickHandler = () => {
        onClick();
        onClose();
    };
    return (
        <div className="dialogwindow">
            <div className="dialogwindow__box dialogwindow-animation ">
                {title ? <h1 className="dialogwindow__title">{title}</h1> : ''}
                {amount ? (
                    <>
                        <p className="dialogwindow__header">
                            You’ve earned Non-Zone points
                        </p>
                        <p className="dialogwindow__amount">
                            {'+' + amount + 'nz'}
                        </p>
                    </>
                ) : (
                    ''
                )}
                <p className="dialogwindow__text">{text}</p>
            </div>
            <button
                onClick={() => onClickHandler()}
                className="dialogwindow__button dialogwindow-animation "
            >
                Got it!
            </button>
        </div>
    );
};
