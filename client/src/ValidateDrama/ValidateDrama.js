import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./ValidateDrama.scss";

function ValidateDrama({ validatedDramas, setValidatedDramas }) {
  const [dramas, setDramas] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch movie data with status 3
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/movie-list?status=3"); // Ambil data movie dengan status 3
        const data = await response.json();
        setDramas(data);
        setLoading(false); // Matikan loading setelah data didapat
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies(); // Panggil fungsi untuk mengambil data
  }, []);

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

      {/* Tampilkan data yang diambil dari backend */}
      {loading ? (
        <p>Loading data...</p>
      ) : (
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
                <td>{drama.title}</td>
                <td>{drama.status}</td>
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
      )}
    </Container>
  );
}

export default ValidateDrama;
