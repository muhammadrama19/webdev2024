import React from 'react';
import { Button } from 'react-bootstrap';
// import './SubmitButton.scss';

const SubmitButton = ({ label }) => {
  return (
    <Button variant="primary" type="submit" block>
      {label}
    </Button>
  );
};

export default SubmitButton;
