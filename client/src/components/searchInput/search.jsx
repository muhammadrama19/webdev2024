import React from 'react';
import { Form, FormControl, InputGroup, Col } from 'react-bootstrap';
import './search.scss';

const SearchInput = () => {
  return (
    <Form>
      <Form.Group>
        <InputGroup>
          <Col xs={12}>
            <Form.Label className="input-label">Label</Form.Label>
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
