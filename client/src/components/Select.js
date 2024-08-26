import React from "react";
import "../styles/select.css";

const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className="select-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select name={name} value={value} onChange={onChange} className="select">
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
