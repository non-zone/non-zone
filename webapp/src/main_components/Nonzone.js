import React from 'react';
import { Interface, svg, Sliderr, Spinner } from '../components';
import './nonzone.css';
import { useParams } from 'react-router-dom';
import { useLoadStory } from '../api';

export const Nonzone = ({ onClose }) => {
    const { objectId } = useParams();
    console.log('Nonzoneid:', objectId);
    const { error, loading, data: object } = useLoadStory(objectId);

    const {
        Nonzone: {
            // star,
            // flag,
            close,
        },
    } = svg;
    return (
        <>
            {error && <div>{error.toString()}</div>}
            {loading && <Spinner />}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                // centralButton={{
                //     svg: flag,
                //     name: 'Save this non-zone',
                //     onClick: () => alert('it works'),
                // }}
                // rightButton={{
                //     onClick: () => alert('you logged out'),
                //     svg: star,
                // }}
            />
            {!!object && (
                <div className="nonzone__wrapper ">
                    <div className="nonzone__page">
                        {/* <div
                        className="nonzone__image"
                        style={{
                            backgroundImage: `url(${object?.logoURL})`,
                        }}
                    ></div> */}
                        {!!object?.image && (
                            <div className="nonzone__image_holder">
                                <img
                                    alt="snapshot"
                                    className="nonzone__image"
                                    src={object?.image}
                                />
                            </div>
                        )}
                        <p className="nonzone__type">{object?.title}</p>
                        <p className="nonzone__author"></p>
                        <p className="nonzone__text">{object?.description}</p>
                        <p className="nonzone__type">Story type</p>
                        <Sliderr
                            onChange={(a) => console.log(a)}
                            elements={[['#' + object?.kind]]}
                        />
                        <div className="nonzone__bottom"></div>
                    </div>
                </div>
            )}
        </>
    );
};
