import React from 'react';
import './closebutton.css';

export const CloseButton = ({ onClick }) => {
    return (
        <button className="closebutton" onClick={onClick}>
            X
        </button>
    );
};
