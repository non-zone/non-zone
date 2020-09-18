import React from 'react';
import './TakePicture.css';
import { uploadToCloudinary } from 'nonzone-lib';

export const TakePicture = ({ children, onChange, onStartUpload }) => {
    return (
        <>
            <input
                type="file"
                accept="camera/*"
                className="takepicture__input"
                onChange={async (e) => {
                    onStartUpload && onStartUpload();
                    const info = await uploadToCloudinary(e.target.files[0]);
                    onChange(info.secure_url);
                }}
            ></input>
            {children}
        </>
    );
};
