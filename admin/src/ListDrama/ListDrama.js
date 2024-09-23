import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Table, Form, Container, Modal, Button, Col, Dropdown } from "react-bootstrap";
import "../ListDrama/ListDrama.css"; 

const ListDrama = ({ trashDramas, setTrashDramas }) => {
  const [filterStatus, setFilterStatus] = useState("Unapproved");
  const [showCount, setShowCount] = useState(10);
  const [dramas, setDramas] = useState([
    {
      id: 1,
      title: "[2024] Japan - Eye Love You",
      actors: "Takuya Kimura, Takeuchi Yuko, Neinen Reina",
      genres: "Romance, Adventures, Comedy",
      synopsis: "I love this drama. It taught me a lot about money and finance. Love is not everything. We need to face the reality too. Being stoic is the best.",
      status: "Unapproved"
    },
    {
      id: 2,
      title: "Rama - Pemuda Ciamis",
      actors: "M. Rama Nurimani",
      genres: "Romance, Adventures, Comedy",
      synopsis: "A lovely boy from Ciamis.",
      status: "Unapproved"
    },
    {
      id: 3,
      title: "Azhar - Pemuda Bekasi",
      actors: "M. Azharuddin Hamid",
      genres: "Romance, Sci-fi, Comedy",
      synopsis: "A backpacker from Bekasi.",
      status: "Unapproved"
    },
  ]);

  const [editingDrama, setEditingDrama] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (drama) => {
    setEditingDrama(drama);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const deletedDrama = dramas.find((drama) => drama.id === id);
    setTrashDramas([...trashDramas, deletedDrama]); // Pindahkan movie ke Trash
    setDramas(dramas.filter((drama) => drama.id !== id)); // Hapus dari list utama
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
          <Button
            className="btn btn-danger me-2"
            onClick={handleViewTrash}
          >
            Trash
          </Button>

          <Button
            className="btn btn-success"
            onClick={handleAddMovies}
          >
            Add Movies
          </Button>
        </div>
      </div>

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
                <td>{drama.actors}</td>
                <td>{drama.genres}</td>
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
                  value={editingDrama.actors}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaGenres">
                <Form.Label>Genres</Form.Label>
                <Form.Control
                  type="text"
                  name="genres"
                  value={editingDrama.genres}
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
              style={{ backgroundColor: "#ff5722", borderColor: "#ff5722" }}
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
