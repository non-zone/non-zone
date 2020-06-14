import React, { useState } from 'react';
import { svg } from '../components';
import './object.css';

const MapObject = (props) => {
    const { title, description, onClick } = props;
    const [state, setState] = useState(false);
    return (
        <div className="mapobject" onClick={() => setState(!state)}>
			{svg.MapObject.vortex}
            {state ? (
                <>
                    <div className="mapobject__box mapobject__animation">
                        <div className="mapobject__header">
                            <h5>{title}</h5>
                            <p>{description}</p>
                        </div>
                        <button
                            className="mapobject__button"
                            onClick={() => onClick()}
                        >
                            open this nonzone
                        </button>
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

export const renderObject = ({ item: { title, description } }) => {
    return (
        <MapObject
            title={title}
            description={description}
            onClick={() => alert('it works')}
        />
    );
};
