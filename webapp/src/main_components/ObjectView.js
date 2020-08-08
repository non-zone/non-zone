import React, { useState } from 'react';
import { svg } from '../components';
import './object.css';

const MapObject = (props) => {
    const { title, description, type, onClick } = props;
    const [state, setState] = useState(false);
    return (
        <div className="mapobject" onClick={() => setState(!state)}>
            {type !== 'place' ? svg.MapObject.vortex : svg.MapObject.vortex2}
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
                            Open this Story
                        </button>
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

export const getRenderObject = (cbOnClick, showMerchants) => ({
    item: { id, title, description = '', type, external_data },
}) => {
    // console.log('getRenderObject', {
    //     showMerchants,
    //     title,
    //     id,
    //     type,
    //     external_data,
    // });
    if (
        !showMerchants &&
        type === 'place'
        // ||
        // (showMerchants && type === 'story')
    ) {
        // console.log('ignore');
        return null;
    }
    return (
        <MapObject
            title={title}
            description={
                description.length > 200
                    ? description.substring(0, 200) + '...'
                    : description
            }
            type={type}
            onClick={() => cbOnClick(id)}
        />
    );
};
