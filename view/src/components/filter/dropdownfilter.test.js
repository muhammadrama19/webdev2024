import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DropdownFilter from './dropdownfilter'; 

describe('DropdownFilter Component', () => {
  it('renders the DropdownFilter component with props', () => {
    const props = {
      label: 'Select an option',
      options: ['Option 1', 'Option 2', 'Option 3'],
      onSelect: jest.fn(),
    };

    render(<DropdownFilter {...props} />);

 
    const labelOption = screen.getByText(props.label);
    expect(labelOption).toBeInTheDocument();

    props.options.forEach(option => {
      const optionElement = screen.getByText(option);
      expect(optionElement).toBeInTheDocument();
    });
  });

  it('calls onSelect with the correct value when an option is selected', () => {
    const props = {
      label: 'Select an option',
      options: ['Option 1', 'Option 2', 'Option 3'],
      onSelect: jest.fn(),
    };

    render(<DropdownFilter {...props} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option 2' } });

    expect(props.onSelect).toHaveBeenCalledWith('Option 2');
  });
});