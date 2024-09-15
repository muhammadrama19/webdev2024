import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import "./dropdownFilter.scss"; // Ensure this path is correct

const DropdownFilterCustom = ({ label, options, onSelect }) => {
  return (
    <Dropdown className="dropdown-filter">
      <Dropdown.Toggle className="label">
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Add a "None" or "All" option */}
        <Dropdown.Item onClick={() => onSelect("")}>Select</Dropdown.Item>

        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={() => onSelect(option)} className="select">
            {option} 
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

DropdownFilterCustom.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default DropdownFilterCustom;
