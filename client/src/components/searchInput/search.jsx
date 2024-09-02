import React from 'react';
import { Form, FormControl, InputGroup, Col } from 'react-bootstrap';
import DropdownFilter from '../dropdownfilter/dropdownFilter';
import './search.scss';
import CustomButton from '../button/button';

const SearchInput = () => {
  return (
    <Form>
      <Form.Group>
        <InputGroup>
          <Col xs={12} lg={8}>
            <Form.Label className="input-label text-white-500">Search Movie</Form.Label>
            <FormControl
              type="text"
              placeholder="eg. Avenger"
              className="glass-input"
            />
          </Col>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};

export default SearchInput;
