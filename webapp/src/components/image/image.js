import React, { useState } from 'react';
import './image.css';

export const Image = ({ onClose }) => {
    const [display, setDisplay] = useState(true);
    return (
        <>
            {display ? (
                <div className="image">
                    <div
                        onClick={() => {
                            setDisplay(false);
                            onClose && onClose();
                        }}
                        className="image__pic splash-appearance"
                    ></div>
                </div>
            ) : (
                ''
            )}
        </>
    );
};
