import React, { useState } from "react";
import { Table, Form,Container, Modal, Button } from "react-bootstrap";
import "../ListDrama/ListDrama.css"; // Make sure you have this CSS file

const ListDrama = () => {
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
    // Add more data here
  ]);

  const [editingDrama, setEditingDrama] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (drama) => {
    setEditingDrama(drama);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDramas(dramas.filter(drama => drama.id !== id));
  };

  const handleSave = () => {
    setDramas(dramas.map(drama =>
      drama.id === editingDrama.id ? editingDrama : drama
    ));
    setEditingDrama(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setEditingDrama({
      ...editingDrama,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="list-drama-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <span className="me-2">Shows</span>
          <Form.Select
            value={showCount}
            onChange={(e) => setShowCount(e.target.value)}
            aria-label="Select show count"
            style={{ width: "100px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </Form.Select>
        </div>
        <div>
          <Form.Control
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
      </div>

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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
              onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }} onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ListDrama;
