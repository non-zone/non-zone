import React from 'react';
import './spinner.css';

export const Spinner = () => (
    <div className="spinner-wrap" onClick={(e) => e.stopPropagation()}>
        <div class="lds-dual-ring"></div>
    </div>
);
