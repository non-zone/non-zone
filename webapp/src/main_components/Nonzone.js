import React, { useState } from 'react';
import { Interface, svg, Slider } from '../components';
import './nonzone.css';

export const Nonzone = ({ onClose }) => {
    const [input, setInput] = useState('Title');
    const {
        Create: { pin, shot, close },
    } = svg;
    return (
        <>
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: pin,
                    name: 'Pin this nonzone',
                    onClick: () => alert('it works'),
                }}
                rightButton={{
                    onClick: () => alert('you logged out'),
                    svg: shot,
                }}
            />
            <div className="create__wrapper">
                <div className="create__page">
                    <div
                        className="create__image"
                        style={{
                            backgroundImage:
                                'url(https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA)',
                        }}
                    ></div>
                    <input
                        className="create__title"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></input>
                    <textarea
                        className="create__textarea"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></textarea>
                    <p className="create__welcome">Nonzone type?</p>
                    <Slider
                        onChange={(a) => console.log(a)}
                        elements={[['#Story'], ['#Memory'], ['#Search']]}
                    />
                    <div className="create__bottom"></div>
                </div>
            </div>
        </>
    );
};
