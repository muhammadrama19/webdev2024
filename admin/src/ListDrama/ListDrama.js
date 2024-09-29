import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Form, Container, Modal, Button, Col, Dropdown } from "react-bootstrap";
import "../ListDrama/ListDrama.css";

const ListDrama = ({ trashDramas, setTrashDramas }) => {
  const [showCount, setShowCount] = useState(10);
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [editingDrama, setEditingDrama] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // useEffect to fetch data from backend
  useEffect(() => {
    fetch('http://localhost:8001/movie-list') // Pastikan URL sesuai dengan backend kamu
      .then((response) => response.json())
      .then((data) => {
        // Set data yang diambil langsung ke state dramas
        setDramas(data);
        setLoading(false); // Data has been loaded
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading on error
      });
  }, []);

  const handleEdit = (drama) => {
    setEditingDrama(drama);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const deletedDrama = dramas.find((drama) => drama.id === id);
    setTrashDramas([...trashDramas, deletedDrama]);
    setDramas(dramas.filter((drama) => drama.id !== id));
  };

  const handleSave = () => {
    setDramas(
      dramas.map((drama) =>
        drama.id === editingDrama.id ? editingDrama : drama
      )
    );
    setEditingDrama(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setEditingDrama({
      ...editingDrama,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleAddMovies = () => {
    navigate("/movie-input");
  };

  const handleViewTrash = () => {
    navigate("/movie-trash");
  };

  return (
    <Container>
      <Container className="App">
        <h1 className="title">Movies List</h1>
      </Container>

      <div className="list-drama-header d-flex justify-content-between mb-3">
        <div className="d-flex">
          <Col xs="auto" className="d-flex me-3">
            <Dropdown onSelect={setShowCount}>
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
          <input
            type="text"
            className="search-input"
            placeholder="Search"
          />
        </div>

        <div>
          <Button className="btn btn-danger me-2" onClick={handleViewTrash}>
            Trash
          </Button>

          <Button className="btn btn-success" onClick={handleAddMovies}>
            Add Movies
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="drama-table-wrapper">
          <Table striped bordered hover className="drama-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Drama</th>
                <th>Actors</th>
                <th>Genres</th>
                <th>Synopsis</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dramas.slice(0, showCount).map((drama, index) => (
                <tr key={drama.id}>
                  <td>{index + 1}</td>
                  <td>{drama.title}</td>
                  <td>{drama.Actors}</td> {/* Menggunakan data Actors langsung */}
                  <td>{drama.Genres}</td> {/* Menggunakan data Genres langsung */}
                  <td>{drama.synopsis}</td>
                  <td>
                    <Container className="action-button">
                      <Button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(drama)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(drama.id)}
                      >
                        Delete
                      </Button>
                    </Container>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {editingDrama && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Drama</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDramaTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editingDrama.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaActors">
                <Form.Label>Actors</Form.Label>
                <Form.Control
                  type="text"
                  name="actors"
                  value={editingDrama.Actors}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaGenres">
                <Form.Label>Genres</Form.Label>
                <Form.Control
                  type="text"
                  name="genres"
                  value={editingDrama.Genres}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaSynopsis">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="synopsis"
                  value={editingDrama.synopsis}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ListDrama;
