import React from 'react';
import { Interface } from '../components';
import { svg } from '../components';

export const NavigationWidget = ({
    autolocate,
    toggleMerchants,
    createZone,
    children,
}) => {
    const {
        Navigation: { current, create, merch },
    } = svg;
    return (
        <>
            {children}
            <Interface
                leftButton={{
                    onClick: toggleMerchants,
                    svg: merch,
                }}
                centralButton={{
                    onClick: createZone,
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
