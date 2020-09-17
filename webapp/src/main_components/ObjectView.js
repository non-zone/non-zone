import React, { useState } from 'react';
import { svg } from '../components';
import cx from 'classnames';
import './object.css';

const MapObject = (props) => {
    const { title, description, type, hotness, onClick } = props;
    const [state, setState] = useState(false);
    return (
        <div
            className={cx('mapobject', { [`hot-${hotness}`]: !!hotness })}
            onClick={() => setState(!state)}
        >
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

export const getRenderObject = (cbOnClick, showMerchants, cbGetLikes) => ({
    item: { id, title, description = '', type, external_data },
}) => {
    const likesObj = cbGetLikes?.(id);
    // console.log('LIKES', likesObj);

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
            hotness={likesObj ? 1 : null}
            title={title}
            description={
                description.length > 200
                    ? description.substring(0, 200) + '...'
                    : description
            }
            type={type}
            onClick={() => cbOnClick(external_data?.id || id)}
        />
    );
};
