import React, { useState } from 'react';
import { Interface, svg, Slider } from '../components';
import './create.css';
import { TakePicture } from './TakePicture';

export const Create = ({ onClose, onSave }) => {
    const [state, setState] = useState({ type: 'story' });
    const {
        Create: { pin, shot, close },
    } = svg;

    //TODO
    const [loading, setLoading] = useState(false);
    const _onSave = () => {
        if (!state.title) return;
        setLoading(true);
        onSave(state)
            .finally(() => setLoading(false))
            .catch((err) => alert(err.message));
    };

    console.log('create data:', state);
    return (
        <>
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: pin,
                    name: 'Pin this nonzone',
                    onClick: _onSave,
                }}
                rightButton={{
                    // onClick: signout,
                    // svg: shot,
                    svg: (
                        <TakePicture
                            onChange={(image) =>
                                setState({
                                    ...state,
                                    image,
                                })
                            }
                        >
                            {shot}
                        </TakePicture>
                    ),
                }}
            />
            <div className="create__wrapper">
                <div className="create__page">
                    <div
                        className="create__image"
                        style={{
                            backgroundImage:
                                // 'url(https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA)',
                                `url(${state.image})`,
                        }}
                    ></div>
                    <input
                        className="create__title"
                        type="text"
                        value={state.title || ''}
                        placeholder="Title"
                        onChange={(e) =>
                            setState({ ...state, title: e.target.value })
                        }
                    ></input>
                    <textarea
                        className="create__textarea"
                        type="text"
                        value={state.description || ''}
                        placeholder="Description"
                        onChange={(e) =>
                            setState({ ...state, description: e.target.value })
                        }
                    ></textarea>
                    <p className="create__welcome">Nonzone type?</p>
                    <Slider
                        onChange={(type) => setState({ ...state, type })}
                        elements={[
                            ['#Story', '', 'story'],
                            ['#Memory', '', 'memory'],
                            ['#Search', '', 'search'],
                        ]}
                    />
                    <div className="create__bottom"></div>
                </div>
            </div>
        </>
    );
};
