import React from 'react';
import './TakePicture.css';
const { REACT_APP_CLOUDINARY_CLOUD_NAME } = process.env;

export const uploadToCloudinary = (cloudName, image) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'gallery_preset');
    return fetch(url, {
        method: 'POST',
        body: data,
    }).then((res) => res.json());
};

const uploadImage = (image) =>
    uploadToCloudinary(REACT_APP_CLOUDINARY_CLOUD_NAME, image);

export const TakePicture = ({ children, onChange }) => {
    return (
        <>
            <input
                type="file"
                accept="camera/*"
                className="takepicture__input"
                onChange={async (e) => {
                    const info = await uploadImage(e.target.files[0]);
                    onChange(info.secure_url);
                }}
            ></input>
            {children}
        </>
    );
};
