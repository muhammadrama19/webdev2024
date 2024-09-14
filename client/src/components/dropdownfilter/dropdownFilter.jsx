import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import './dropdownFilter.scss'; // Ensure this path is correct

const DropdownFilterCustom = ({ label, options, onSelect }) => {
  return (
    <Dropdown className="dropdown-filter">
      <Dropdown.Toggle variant="success" id={`${label}-dropdown`}>
        {label}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={() => onSelect(option)}>
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
