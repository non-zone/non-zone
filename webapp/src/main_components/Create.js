import React, { useState, useEffect } from 'react';
import { Interface, svg, Slider, DialogWindow } from '../components';
import './create.css';
import { TakePicture } from './TakePicture';
import cx from 'classnames';
import { useParams } from 'react-router-dom';
import { useLoadStory } from '../api';

const MIN_DESCR_LENGTH = 150;
const MAX_DESCR_LENGTH = 600;

const {
    Create: { pin, shot, close },
    Profile: { save },
} = svg;

const Congrats = ({ onClose }) => {
    return (
        <DialogWindow
            amount={5}
            title={'Congrats! You created a new non-zone!'}
            onClose={onClose}
        />
    );
};

export const CreateSaveStory = ({
    existingData,
    onClose,
    onSave,
    onPublish,
}) => {
    const [state, setState] = useState(
        existingData || { type: 'story', title: '', description: '' }
    );
    useEffect(() => {
        // once saved, replace the state with saved data
        if (existingData) setState(existingData);
    }, [existingData]);

    const descrLength = state.description?.length || 0;

    const isCreated = !!existingData;
    const isDirtyState = isCreated && existingData !== state;
    const isPublished = existingData?.ocm_id;
    const canPublish = isCreated && !isPublished && !isDirtyState;
    let actionTitle =
        (isPublished && 'Published') || (canPublish ? 'Publish' : 'Save');

    const [loading, setLoading] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const handleAction = async () => {
        if (isPublished || loading) return;
        try {
            // if (!state.title) return;

            setLoading(true);
            if (canPublish) {
                await onPublish(state);
                setShowCongrats(true);
            } else {
                await onSave(state);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
            // onClose();
        }
    };

    if (loading) actionTitle = 'saving...';

    // console.log('create data:', state);
    return (
        <>
            {showCongrats && (
                <Congrats onClose={() => setShowCongrats(false)} />
            )}
            <Interface
                leftButton={{ onClick: onClose, svg: close }}
                centralButton={{
                    svg: !isPublished && (canPublish ? pin : save),
                    // name: 'Pin this non-zone',
                    name: actionTitle,
                    onClick: handleAction,
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

export const EditStory = ({ onClose, onSave, onPublish }) => {
    const { storyId } = useParams();

    const { error, loading, data = null } = useLoadStory(storyId);

    if (!storyId) return <div>Story id not found</div>;
    if (error) return <div>Error loading story: {error}</div>;
    if (loading) return <div>Loading...</div>;
    // return <div>{JSON.stringify(data)}</div>;
    return (
        <CreateSaveStory
            existingData={data}
            onClose={onClose}
            onSave={onSave}
            onPublish={() => onPublish(data)}
        />
    );
};
