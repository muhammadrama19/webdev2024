import { Container, Row, Col, Button } from 'react-bootstrap';
import './errorPage.scss'; // Import the styles
import ButtonCustom from '../../../components/button/button'; // Import the button component

const ErrorPage = () => {
  return (
    <Container fluid className="error-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={10} md={8} lg={6} className="text-center">
          <h1 >404 - Movie Not Found</h1>
          <p className="lead text-secondary mb-4">
            The movie you are looking for is not available or has been removed.
          </p>
          <ButtonCustom variant='primary' > Back to Home</ButtonCustom>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
