import React, { useState } from 'react';
import { Interface, svg, Slider, DialogWindow } from '../components';
import './create.css';
import { TakePicture } from './TakePicture';
import cx from 'classnames';

const MIN_DESCR_LENGTH = 150;
const MAX_DESCR_LENGTH = 600;

const Congrats = ({ onClose }) => {
    return (
        <DialogWindow
            amount={5}
            title={'Congrats! You created a new non-zone!'}
            onClose={onClose}
        />
    );
};

export const Create = ({ onClose, onSave }) => {
    const [state, setState] = useState({ type: 'story' });
    const descrLength = state.description?.length || 0;
    const {
        Create: { pin, shot, close },
    } = svg;

    //TODO
    // const [loading, setLoading] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const _onSave = () => {
        if (!state.title) return;
        // setLoading(true);
        setTimeout(() => setShowCongrats(true), 1000);
        onSave(state)
            .finally(() => {
                // setLoading(false);
                // onClose();
            })
            .catch((err) => alert(err.message));
    };

    // console.log('create data:', state);
    return (
        <>
            {showCongrats && <Congrats onClose={onClose} />}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: pin,
                    name: 'Pin this non-zone',
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
                    {/* <div
                        className="create__image"
                        style={{
                            backgroundImage:
                                // 'url(https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA)',
                                `url(${state.image})`,
                        }}
                    ></div> */}
                    {!!state.image && (
                        <div className="create__image_holder">
                            <img
                                className="create__image"
                                alt="snapshot"
                                src={state.image}
                            />
                        </div>
                    )}
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
                    <div
                        className={cx('create__descr_char_counter', {
                            warning: descrLength > MAX_DESCR_LENGTH,
                            good:
                                descrLength >= MIN_DESCR_LENGTH &&
                                descrLength <= MAX_DESCR_LENGTH,
                        })}
                    >
                        {!!descrLength && `${descrLength} chars`}
                    </div>
                    <p className="create__welcome">Non-zone type?</p>
                    <Slider
                        onChange={(type) => setState({ ...state, type })}
                        activeElement={state.type}
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
