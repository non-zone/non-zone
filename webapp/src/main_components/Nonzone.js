import React, { useState } from 'react';
import { Interface, svg, Sliderr } from '../components';
import './nonzone.css';

export const Nonzone = ({ onClose }) => {
    const [input, setInput] = useState('Title');
    const {
        Nonzone: { star, flag, close },
    } = svg;
    return (
        <>
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: flag,
                    name: 'Save this nonzone',
                    onClick: () => alert('it works'),
                }}
                rightButton={{
                    onClick: () => alert('you logged out'),
                    svg: star,
                }}
            />
            <div className="nonzone__wrapper">
                <div className="nonzone__page">
                    <div
                        className="nonzone__image"
                        style={{
                            backgroundImage:
                                'url(https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA)',
                        }}
                    ></div>
					<p className="nonzone__type">This is title</p>
					<p className="nonzone__author">This is author</p>
                    <p className="nonzone__text">
                        Suspendisse potenti. Curabitur vel sagittis risus. Fusce
                        condimentum malesuada dolor, eget mollis neque porttitor
                        quis. Nam semper elit eros, at convallis lectus
                        tristique eu. Mauris mollis enim at augue mattis, nec
                        varius tellus ultricies. Etiam lobortis turpis vel
                        scelerisque lacinia. Nulla efficitur sed dui a faucibus.
                        Maecenas et consequat libero, vel auctor metus. Integer
                        malesuada ac eros lobortis consectetur. Curabitur quis
                        venenatis dolor, eget ultrices massa.
                    </p>
                    <p className="nonzone__type">Nonzone type</p>
                    <Sliderr
                        onChange={(a) => console.log(a)}
                        elements={[['#Story'], ['#Memory'], ['#Search']]}
                    />
                    <div className="nonzone__bottom"></div>
                </div>
            </div>
        </>
    );
};
