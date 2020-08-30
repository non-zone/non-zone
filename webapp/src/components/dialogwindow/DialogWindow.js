import React from 'react';
import './dialogwindow.css';

/**
 * Dialogwindow - represents all types of tips and messages in ainterface
 *
 * @param {number} amount - amount of coins which user has earned // put this props to display special type of this window
 * @param {Function} onClick - additional functional
 * @param {string} title - title for this window
 * @param {string} secondaryAction - second button title, optional
 * @param {Function} onClickSecondary - second button handler
 */

export const DialogWindow = ({
    amount = 0,
    currency = 'SPACE',
    onClick = () => alert('onClose'),
    text = '',
    title = 'Warning',
    subtitle = '',
    action = 'Got it!',
    secondaryAction = null,
    onClickSecondary,
}) => {
    return (
        <div className="dialogwindow">
            <div className="dialogwindow__box dialogwindow-animation ">
                {title ? <h1 className="dialogwindow__title">{title}</h1> : ''}
                {amount ? (
                    <>
                        <p className="dialogwindow__header">{subtitle}</p>
                        <p className="dialogwindow__amount">
                            {(amount >= 0 ? '+' : '') + amount + ' ' + currency}
                        </p>
                    </>
                ) : (
                    ''
                )}
                <p className="dialogwindow__text">{text}</p>
            </div>
            <button
                onClick={onClick}
                className="dialogwindow__button dialogwindow-animation "
            >
                {action}
            </button>
            {!!secondaryAction && (
                <button
                    onClick={onClickSecondary}
                    className="dialogwindow__button dialogwindow-animation secondary "
                >
                    {secondaryAction}
                </button>
            )}
        </div>
    );
};
