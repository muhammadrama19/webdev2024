import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import './coverDetail.scss';

const CoverDetail = ({ srcBackground = "https://via.assets.so/img.jpg?w=1024&h=307&tc=WHITE&bg=&t=no background available" }) => {
  return (
    <Container fluid className='coverDetail'>
      <Row>
        <Col xs={12} sm={12} md={6} lg={4}>
          <img 
            src={srcBackground} 
            alt="background"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CoverDetail;
