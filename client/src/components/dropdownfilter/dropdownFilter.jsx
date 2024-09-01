import React from 'react';
import { Form } from 'react-bootstrap';
import './dropdownFilter.scss';

const DropdownFilter = ({ label, options, onSelect }) => {
  return (
    <Form.Group controlId={`dropdown-${label}`} className="dropdown-filter">
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" onChange={(e) => onSelect(e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default DropdownFilter;
