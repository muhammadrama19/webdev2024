import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import "./ValidateDrama.css";

function ValidateDrama() {
  const [dramas, SetValidateDramas] = useState([
    {
      id: 1,
      username: "Nara",
      drama: "[2024] Japan - Eye Love You",
      status: "Unapproved",
      isChecked: false,
    },
    {
      id: 2,
      username: "Luffy",
      drama: "[2024] One Piece",
      status: "Unapproved",
      isChecked: false,
    },
  ]);

  const [filter, setFilter] = useState("None");
  const [showCount, setShowCount] = useState(10);

  const handleApproveDrama = (id) => {
    SetValidateDramas(dramas.map((drama) =>
      drama.id === id ? { ...drama, status: "Approved" } : drama
    ));
  };

  const handleDeleteDrama = (id) => {
    SetValidateDramas(dramas.filter((drama) => drama.id !== id));
  };

  const handleFilterChange = (selectedFilter) => setFilter(selectedFilter);
  const handleShowCountChange = (count) => setShowCount(count);

  const filteredDramas = dramas.filter((drama) => {
    if (filter === "None") return true;
    return drama.status === filter;
  });

  return (
    <Container className="validas-drama-container">
      {/* Filter Section */}
      <Row className="mb-3">
        <Col md={3}>
          <Dropdown onSelect={handleFilterChange}>
            <Dropdown.Toggle variant="light" id="dropdown-filter">
              Filtered by: {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="None">None</Dropdown.Item>
              <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
              <Dropdown.Item eventKey="Unapproved">Unapproved</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={2}>
          <Dropdown onSelect={handleShowCountChange}>
            <Dropdown.Toggle variant="light" id="dropdown-show">
              Shows: {showCount}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[10, 20, 50].map((count) => (
                <Dropdown.Item key={count} eventKey={count}>
                  {count}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="light" disabled>
            <i className="bi bi-search"></i>
          </Button>
        </Col>
      </Row>

      {/* Table Section */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Drama</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDramas.slice(0, showCount).map((drama) => (
            <tr key={drama.id} className={drama.status === "Unapproved" ? "table-danger" : ""}>
              <td>{drama.username}</td>
              <td>{drama.drama}</td>
              <td>{drama.status}</td>
              <td>
                <Button
                  variant="success"
                  className="me-2"
                  size="sm"
                  onClick={() => handleApproveDrama(drama.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteDrama(drama.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ValidateDrama;
