import React, { useState, useEffect } from 'react';
import { Interface, svg, Slider, DialogWindow } from '../components';
import './create.css';
import { TakePicture } from './TakePicture';
import cx from 'classnames';
import { useParams } from 'react-router-dom';
import {
    useLoadStory,
    isPrepublishSupported,
    getPublishPrice,
    getCurrency,
} from '../api';
import { useAuth, useUserWallet } from '../Auth';
import { Spinner } from '../components/spinner/Spinner';

const MIN_DESCR_LENGTH = 150;
const MAX_DESCR_LENGTH = 600;

const CURRENCY = getCurrency();

const {
    Create: { pin, shot, close },
    Profile: { save },
} = svg;

const Congrats = ({ cost, onClose }) => {
    return (
        <DialogWindow
            title={'Congrats! You added a new Story!'}
            subtitle="You’ve spent Non-Zone points"
            amount={-cost}
            currency={CURRENCY}
            onClick={onClose}
        />
    );
};

const ErrorMessage = ({ children }) => {
    const ref = React.useRef();
    useEffect(() => {
        ref.current.scrollIntoView();
    }, []);
    return (
        <div className="error-message" ref={ref}>
            {children}
        </div>
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

    const { user } = useAuth();
    const { balance } = useUserWallet(user?.uid);

    const descrLength = state.description?.length || 0;

    const isCreated = !!existingData;
    const isDirtyState = isCreated && existingData !== state;
    const isPublished = existingData?.published;
    const canPublish = isCreated && !isPublished && !isDirtyState;
    const actionTitle =
        (isPublished && 'Published') || (canPublish ? 'Publish' : 'Save');

    const [loading, setLoading] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [showPublish, setShowPublish] = useState(false);

    const [cost, setCost] = useState();

    const [errors, setErrors] = useState();

    const handleAction = async () => {
        if (isPublished || loading) return;
        setErrors(null);

        try {
            // if (!state.title) return;

            setLoading(true);
            if (canPublish) {
                let err = validate(state);
                if (err) {
                    console.log('ERRORS', err);
                    setErrors(err);
                    return;
                }
                const price = await getPublishPrice(state);
                err = validateBalance(balance, price);
                if (err) {
                    console.log('ERRORS', err);
                    setErrors(err);
                    return;
                }
                setCost(price);
                setShowPublish(true);
                // await onPublish(state);
                // setShowCongrats(true);
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

    const handlePublish = async () => {
        try {
            // if (!state.title) return;

            setLoading(true);
            await onPublish(state);
            setShowPublish(false);
            setShowCongrats(true);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
            // onClose();
        }
    };

    // console.log('create data:', state);
    return (
        <>
            {loading && <Spinner />}
            {showPublish && (
                <DialogWindow
                    amount={cost}
                    currency={CURRENCY}
                    title={`This will cost`}
                    subtitle=""
                    action="Let's do it!"
                    secondaryAction="Save For Later"
                    onClick={() => handlePublish()}
                    onClickSecondary={() => setShowPublish(false)}
                />
            )}
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
                            onStartUpload={() => setLoading(true)}
                            onChange={(image) => {
                                setState({
                                    ...state,
                                    image,
                                });
                                setLoading(false);
                            }}
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
                    {!!errors?.image && (
                        <ErrorMessage>{errors.image}</ErrorMessage>
                    )}
                    <input
                        className={cx('create__title', {
                            warning: !!errors?.title,
                        })}
                        type="text"
                        value={state.title || ''}
                        placeholder="Title"
                        onChange={(e) =>
                            setState({ ...state, title: e.target.value })
                        }
                    ></input>
                    {!!errors?.title && (
                        <ErrorMessage>{errors.title}</ErrorMessage>
                    )}
                    <textarea
                        className={cx('create__textarea', {
                            warning: !!errors?.description,
                        })}
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
                    {!!errors?.description && (
                        <ErrorMessage>{errors.description}</ErrorMessage>
                    )}
                    {!!errors?.wallet && (
                        <ErrorMessage>{errors.wallet}</ErrorMessage>
                    )}
                    <p className="create__welcome">Story type</p>
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

const validate = ({ title, description, image }) => {
    const titleWords = title.trim().split(/\s+/).length;
    if (titleWords < 3 || titleWords > 5)
        return { title: 'Title should be between 3 and 5 words' };
    if (
        description.length < MIN_DESCR_LENGTH ||
        description.length > MAX_DESCR_LENGTH
    )
        return {
            description: `Description must be between ${MIN_DESCR_LENGTH} and ${MAX_DESCR_LENGTH} characters`,
        };
    if (!image) return { image: 'Having photo is required' };

    return null;
};

const validateBalance = (balance, cost) => {
    if (balance < cost) {
        return {
            wallet: `You need to have at least ${cost}SPACES in your Non-Zone Wallet`,
        };
    }
};
