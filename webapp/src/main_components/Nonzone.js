import React, { useState } from 'react';
import { Interface, svg, Sliderr } from '../components';
import './nonzone.css';
import { useParams } from 'react-router-dom';
import { useLoadSingleObject } from '@opencommunitymap/react-sdk';

export const Nonzone = ({ onClose }) => {
    const { objectId } = useParams();
    console.log('Nonzoneid:', objectId);
    const { object } = useLoadSingleObject(objectId);

    const {
        Nonzone: { star, flag, close },
    } = svg;
    return (
        <>
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
            <div className="nonzone__wrapper">
                <div className="nonzone__page">
                    <div
                        className="nonzone__image"
                        style={{
                            backgroundImage: `url(${object?.logoURL})`,
                        }}
                    ></div>
                    <p className="nonzone__type">{object?.title}</p>
                    <p className="nonzone__author"></p>
                    <p className="nonzone__text">{object?.description}</p>
                    <p className="nonzone__type">Non-zone type</p>
                    <Sliderr
                        onChange={(a) => console.log(a)}
                        elements={[['#' + object?.external_data?.type]]}
                    />
                    <div className="nonzone__bottom"></div>
                </div>
            </div>
        </>
    );
};
