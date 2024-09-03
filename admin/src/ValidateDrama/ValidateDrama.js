import React from 'react';
import { Container, Row, Col, Table, Form, Button, Dropdown } from 'react-bootstrap';

function ValidateDrama() {
  return (
    <Container fluid>
      {/* Filter Section */}
      <Row className="my-3">
        <Col xs={12} md={3}>
          <Form.Group controlId="filterBy">
            <Form.Label>Filtered by:</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                None
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">None</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Approved</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Unapproved</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Group controlId="shows">
            <Form.Label>Shows:</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                10
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">10</Dropdown.Item>
                <Dropdown.Item href="#/action-2">20</Dropdown.Item>
                <Dropdown.Item href="#/action-3">30</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="light" disabled>
            <i className="bi bi-search"></i>
          </Button>
        </Col>
      </Row>

      {/* Review Table */}
      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check type="checkbox" />
                </th>
                <th>Username</th>
                <th>Drama</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#ffe6e6' }}>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>Nara</td>
                <td>[2024] Japan - Eye Love You</td>
                <td>Unapproved</td>
              </tr>
              <tr>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>Luffy</td>
                <td>[2024] One Piece</td>
                <td>Unapproved</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="my-3">
        <Col xs={12} md={4}>
          <Form.Check type="checkbox" label="Select All" />
        </Col>
        <Col xs={12} md={8} className="text-md-end">
          <Button variant="danger" className="me-2">
            Delete
          </Button>
          <Button variant="success">Approve</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ValidateDrama;
