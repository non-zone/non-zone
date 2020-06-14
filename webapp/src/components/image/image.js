import React, { useState } from 'react';
import './image.css';

export const Image = (props) => {
    const [display, setDisplay] = useState(true);
    return (
        <>
            {display ? (
                <div className="image">
                    <div
                        onClick={() => setDisplay(false)}
                        className="image__pic splash-appearance"
                    ></div>
                </div>
            ) : (
                ''
            )}
        </>
    );
};
