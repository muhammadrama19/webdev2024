// ValidateDrama.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import "./ValidateDrama.scss";

function ValidateDrama() {
  const [dramas, setDramas] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [loading, setLoading] = useState(true);

  // Fetch movie data with status 3
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/movie-list?status=3");
        const data = await response.json();
        setDramas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Approve drama by updating status in place
  const handleApproveDrama = async (id) => {
    try {
      await fetch(`http://localhost:8001/movie-restore/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 1 }),
      });
      
      setDramas(dramas.filter(drama => drama.id !== id)); 
    } catch (error) {
      console.error("Error approving drama:", error);
    }
  };

  // Reject drama by updating status in place
  const handleRejectDrama = async (id) => {
    try {
      await fetch(`http://localhost:8001/movie-rejected/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 4 }),
      });

      setDramas(dramas.filter(drama => drama.id !== id)); 
    } catch (error) {
      console.error("Error rejecting drama:", error);
    }
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">Validate Drama</h1>
      </Container>

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
          <input type="text" className="search-input form-control" placeholder="Search" />
        </Col>
      </Row>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Drama</th>
                <th>Synopsis</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dramas.slice(0, showCount).map((drama) => (
                <tr key={drama.id}>
                  <td>{drama.title}</td>
                  <td>{drama.synopsis}</td>
                  <td>{drama.status === 3 ? "Unapproved" : drama.status === 1 ? "Approved" : "Rejected"}</td>
                  <td>
                    {drama.status === 3 && (
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
          {dramas.length === 0 && (
            <p className="text-center mt-3">There's no movies to validate.</p>
          )}
        </>
      )}
    </Container>
  );
}

export default ValidateDrama;
