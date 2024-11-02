import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './Home.scss';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8001/dashboard')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container fluid className="dashboard">
      <Row className="justify-content-center">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            <Col md={6} lg={3} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Movies</Card.Title>
                  <Card.Text>{data.movieCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Genres</Card.Title>
                  <Card.Text>{data.genreCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Countries</Card.Title>
                  <Card.Text>{data.countryCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Awards</Card.Title>
                  <Card.Text>{data.awardCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
