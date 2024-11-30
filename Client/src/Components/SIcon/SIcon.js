import React from 'react';
import './SIcon.css';

const SIcon = ({ src, alt = 'icon', className = '',onClick }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      onClick={onClick}
      className={`sicon ${className}`} 
    />
  );
};

export default SIcon;
