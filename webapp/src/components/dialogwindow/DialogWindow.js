import React from 'react';
import './dialogwindow.css';

export const DialogWindow = (props) => {
    return (
        <div className="dialogwindow">
            <div className="dialogwindow__box">
                <h1 className="dialogwindow__title">Congratulations</h1>
                <p className="dialogwindow__header">
                    You’ve earned Non-Zone points
                </p>
                <p className="dialogwindow__amount">+40nz</p>
                <p className="dialogwindow__text dialogwindow__header">
                    Use your Zone Points to interact with your favorite
                    non-zones, or reddeem them with experience-providers in the
                    area.
                </p>
            </div>
            <button className="dialogwindow__button">Got it!</button>
        </div>
    );
};
