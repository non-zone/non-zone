import React from 'react';
import './TakePicture.css';
import { uploadToCloudinary } from 'nonzone-lib';

export const TakePicture = ({ children, preset, onChange, onStartUpload }) => {
    return (
        <>
            <input
                type="file"
                accept="camera/*"
                className="takepicture__input"
                onChange={async (e) => {
                    onStartUpload && onStartUpload();
                    const info = await uploadToCloudinary(
                        e.target.files[0],
                        preset
                    );
                    onChange(info.secure_url);
                }}
            ></input>
            {children}
        </>
    );
};
