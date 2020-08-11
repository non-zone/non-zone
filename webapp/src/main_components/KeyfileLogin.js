import React from 'react';
import './KeyfileLogin.css';

export const KeyfileLogin = ({ onFileUpload, onCancel }) => {
    return (
        <div className="keyfile-login">
            <div className="file-input">
                <input
                    type="file"
                    onChange={(e) => {
                        const fileReader = new FileReader();
                        fileReader.onload = async (e) => {
                            const file = JSON.parse(e.target.result);
                            onFileUpload(file);
                        };
                        fileReader.readAsText(e.target.files[0]);
                    }}
                />
                <p>Drop a keyfile to login</p>
            </div>
            <button
                className="navigation__button navigation__create"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    );
};
