import React from 'react';
import './SButton.css';

const SButton = ({className, children, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            className={`sbutton ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default SButton;
