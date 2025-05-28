import React from 'react';
import '../styles/Spinner.css';

export const Spinner = ({ size = 'medium' }) => {
    return (
        <div className={`spinner spinner-${size}`}>
            <div className="spinner-circle"></div>
        </div>
    );
};