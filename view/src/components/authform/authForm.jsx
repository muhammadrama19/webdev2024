import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './authForm.scss';

const AuthForm = ({ title, children, linkText, linkHref }) => {
  return (
    <Container fluid className="auth-form-container">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={12}>
          <div className="auth-form">
            <h2>{title}</h2>
            {children}
            <p className="text-center">
              <a href={linkHref}>{linkText}</a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
