import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./ValidateDrama.css";

function ValidateDrama({ validatedDramas, setValidatedDramas }) {
  const [dramas, setDramas] = useState([
    {
      id: 1,
      username: "Nara",
      drama: "[2024] Japan - Eye Love You",
      status: "Unapproved",
    },
    {
      id: 2,
      username: "Luffy",
      drama: "[2024] One Piece",
      status: "Unapproved",
    },
  ]);

  const [showCount, setShowCount] = useState(10);
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleApproveDrama = (id) => {
    const approvedDrama = dramas.find((drama) => drama.id === id);
    // Simpan drama yang di-approve ke validatedDramas dengan waktu validasi
    setValidatedDramas([
      ...validatedDramas, 
      { 
        drama: approvedDrama.drama, 
        status: "Approved", 
        time: new Date().toLocaleString() // Simpan timestamp waktu validasi
      }
    ]);
    // Hapus drama dari list dramas
    setDramas(dramas.filter((drama) => drama.id !== id));
  };

  const handleRejectDrama = (id) => {
    const rejectedDrama = dramas.find((drama) => drama.id === id);
    // Simpan drama yang di-reject ke validatedDramas dengan waktu validasi
    setValidatedDramas([
      ...validatedDramas, 
      { 
        drama: rejectedDrama.drama, 
        status: "Rejected", 
        time: new Date().toLocaleString() // Simpan timestamp waktu validasi
      }
    ]);
    // Hapus drama dari list dramas
    setDramas(dramas.filter((drama) => drama.id !== id));
  };

  const handleHistoryClick = () => {
    navigate("/validate-history"); // Redirect to history page
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">Validate Drama</h1>
      </Container>

      {/* Filter Section */}
      <Row className="mb-3">
        <Col xs="auto" className="d-flex me-2 align-items-center">
          <Dropdown onSelect={(e) => setShowCount(e)}>
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

        <Col xs="auto" className="d-flex me-2 align-items-center">
          <input
            type="text"
            className="search-input form-control"
            placeholder="Search"
          />
        </Col>

        {/* Tombol History */}
        <Col xs="auto" className="ms-auto">
          <Button variant="warning" onClick={handleHistoryClick}>
            History
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dramas.slice(0, showCount).map((drama) => (
            <tr key={drama.id}>
              <td>{drama.username}</td>
              <td>{drama.drama}</td>
              <td>{drama.status}</td>
              <td>
                {drama.status === "Unapproved" && (
                  <>
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
                      onClick={() => handleRejectDrama(drama.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ValidateDrama;
