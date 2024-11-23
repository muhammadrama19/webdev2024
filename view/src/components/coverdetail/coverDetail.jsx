import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import './coverDetail.scss';
import Button from '../button/button';

const CoverDetail = ({ type, srcBackground }) => {
  return (
    <Container fluid className='coverDetail'>
      <Row>
        <Col xs={12} sm={12} md={6} lg={4}>
          <img 
            src={srcBackground} 
            alt="coverDetail"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CoverDetail;
