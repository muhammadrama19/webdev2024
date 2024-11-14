// ValidateDrama.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Dropdown, Modal } from 'react-bootstrap';
import "./ValidateDrama.scss";

function ValidateDrama() {
  const [dramas, setDramas] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "approve" or "reject"
  const [selectedDrama, setSelectedDrama] = useState(null);
  const [showSynopsisModal, setShowSynopsisModal] = useState(false); // State untuk modal synopsis
  const [fullSynopsis, setFullSynopsis] = useState(''); // Menyimpan synopsis lengkap

  // Fetch movie data with status 3
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/movie-list?status=3", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Data Validasi: ", data);
        setDramas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle approve or reject with confirmation
  const handleAction = (id, type) => {
    setSelectedDrama(id);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "approve") {
        await fetch(`http://localhost:8001/movie-restore/${selectedDrama}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 1 }),
        });
        setDramas(dramas.filter(drama => drama.id !== selectedDrama));
      } else if (actionType === "reject") {
        await fetch(`http://localhost:8001/movie-rejected/${selectedDrama}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 4 }),
        });
        setDramas(dramas.filter(drama => drama.id !== selectedDrama));
      }
    } catch (error) {
      console.error(`Error ${actionType}ing drama:`, error);
    } finally {
      setShowConfirmModal(false);
      setSelectedDrama(null);
      setActionType(null);
    }
  };

  // Fungsi untuk memotong synopsis dan menampilkan "more" jika lebih dari 30 kata
  const renderSynopsis = (synopsis) => {
    const words = synopsis.split(" ");
    if (words.length > 30) {
      const truncatedSynopsis = words.slice(0, 30).join(" ") + "...";
      return (
        <>
          {truncatedSynopsis}{" "}
          <span
            onClick={() => handleShowFullSynopsis(synopsis)}
            style={{ color: "grey", cursor: "pointer" }}
          >
            more
          </span>
        </>
      );
    }
    return synopsis;
  };

  // Fungsi untuk menampilkan modal synopsis lengkap
  const handleShowFullSynopsis = (synopsis) => {
    setFullSynopsis(synopsis);
    setShowSynopsisModal(true);
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
          <Table striped bordered hover responsive className="drama-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Poster</th>
                <th>Drama</th>
                <th>Synopsis</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dramas.slice(0, showCount).map((drama) => (
                <tr key={drama.id}>
                  <td>{dramas.indexOf(drama) + 1}</td>
                  <td>{drama.poster ? (
                        <img
                          src={drama.poster}
                          alt={drama.title}
                          className="poster-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/100x150?text=No+Image";
                          }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}</td>
                  <td>{drama.title}</td>
                  <td>{renderSynopsis(drama.synopsis)}</td>
                  <td>{drama.status === 3 ? "Unapproved" : drama.status === 1 ? "Approved" : "Rejected"}</td>
                  <td>
                    {drama.status === 3 && (
                      <>
                        <Button
                          variant="success"
                          className="me-2"
                          size="sm"
                          onClick={() => handleAction(drama.id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAction(drama.id, "reject")}
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

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm {actionType === "approve" ? "Approve" : "Reject"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {actionType} this movie?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "approve" ? "success" : "danger"}
            onClick={confirmAction}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk menampilkan synopsis lengkap */}
      <Modal
        show={showSynopsisModal}
        onHide={() => setShowSynopsisModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Synopsis</Modal.Title>
        </Modal.Header>
        <Modal.Body>{fullSynopsis}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSynopsisModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ValidateDrama;
