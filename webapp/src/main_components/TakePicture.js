import React from 'react';
import './TakePicture.css';
import { uploadToTextile } from 'nonzone-lib';

export const TakePicture = ({ children, preset, onChange, onStartUpload }) => {
    return (
        <>
            <input
                type="file"
                accept="camera/*"
                className="takepicture__input"
                onChange={async (e) => {
                    onStartUpload && onStartUpload();
                    const info = await uploadToTextile(
                        e.target.files[0],
                    );
                    onChange(info.link);
                }}
            ></input>
            {children}
        </>
    );
};
