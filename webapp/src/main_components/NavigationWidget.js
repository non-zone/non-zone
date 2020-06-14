import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
} from 'react-router-dom';
import { Interface } from '../components';
import { svg } from '../components';

export const NavigationWidget = ({ autolocate, zoomIn, zoomOut, children }) => {
    const router = useHistory();
    const [showModal, setShowModal] = useState(false);
    const {
        Navigation: { current, create, merch },
    } = svg;
    return (
        <>
            {children}
            {showModal ? <div></div> : ''}
            <Interface
                leftButton={{
                    onClick: () => alert('merchants on!'),
                    svg: merch,
                }}
                centralButton={{
                    onClick: () => router.push('/create'),
                    name: 'Create a nonzone',
                    svg: create,
                }}
                rightButton={{
                    onClick: autolocate,
                    svg: current,
                }}
            />
        </>
    );
};
