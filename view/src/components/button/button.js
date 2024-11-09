import React from 'react';
import './button.scss';

const CustomButton = ({ variant = 'default', icon, children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`customButton ${variant} ${className}`}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default CustomButton;
