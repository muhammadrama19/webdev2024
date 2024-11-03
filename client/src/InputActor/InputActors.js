import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import PaginationCustom from "../components/pagination/pagination"; // Import the custom pagination component
import './InputActor.scss';

const ActorList = () => {
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actorData, setActorData] = useState({
    name: '',
    birthdate: '',
    country_name: '',
    actor_picture: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get('http://localhost:8001/actors');
        setActors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching actors:", error);
        setLoading(false);
      }
    };
    fetchActors();
  }, []);

  const handleShowDetail = (actor) => {
    setSelectedActor(actor);
    setShowDetailModal(true);
  };

  const handleShowEdit = (actor) => {
    setActorData({
      name: actor.name,
      birthdate: actor.birthdate,
      country_name: actor.country_name,
      actor_picture: actor.actor_picture
    });
    setSelectedActor(actor);
    setShowEditModal(true);
  };

  const handleShowDelete = (actor) => {
    setSelectedActor(actor);
    setShowDeleteModal(true);
  };

  const handleUpdateActor = async () => {
    try {
      const response = await axios.put(`http://localhost:8001/actors/${selectedActor.id}`, actorData);
      setActors(actors.map(actor => actor.id === selectedActor.id ? { ...actor, ...actorData } : actor));
      setShowEditModal(false);
      setSelectedActor(null);
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };



  const handleDeleteActor = async () => {
    try {
      await axios.put(`http://localhost:8001/actors/delete/${selectedActor.id}`);
      setActors(actors.filter(actor => actor.id !== selectedActor.id));
      setShowDeleteModal(false);
      setSelectedActor(null);
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };
  
  

  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastActor = currentPage * showCount;
  const indexOfFirstActor = indexOfLastActor - showCount;
  const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor);
  const totalPages = Math.ceil(filteredActors.length / showCount);

  return (
    <Container className="actor-list" style={{ padding: '20px' }}>
      <h2 className="my-4" style={{ textAlign: 'center' }}>Actor List</h2>
      <Form.Control
        type="text"
        placeholder="Search actors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Table striped bordered hover responsive className="text-center" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentActors.map((actor) => (
              <tr key={actor.id}>
                <td>
                  <img src={actor.actor_picture} alt={actor.name} className="actor-img" style={{ width: '50px', height: '75px' }} />
                </td>
                <td>{actor.name}</td>
                <td>{new Date(actor.birthdate).toLocaleDateString()}</td>
                <td>{actor.country_name}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetail(actor)} style={{ marginRight: '10px' }}>
                    Details
                  </Button>
                  <Button variant="warning" onClick={() => handleShowEdit(actor)} style={{ marginRight: '10px' }}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleShowDelete(actor)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationCustom
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedActor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedActor?.actor_picture} alt={selectedActor?.name} className="detail-picture mb-3" style={{ width: '100%', height: 'auto' }} />
          <p><strong>Birthdate:</strong> {new Date(selectedActor?.birthdate).toLocaleDateString()}</p>
          <p><strong>Country:</strong> {selectedActor?.country_name}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Actor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formActorName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={actorData.name}
                onChange={(e) => setActorData({ ...actorData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorBirthdate">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="date"
                value={actorData.birthdate}
                onChange={(e) => setActorData({ ...actorData, birthdate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={actorData.country_name}
                onChange={(e) => setActorData({ ...actorData, country_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorPicture">
              <Form.Label>Picture URL</Form.Label>
              <Form.Control
                type="text"
                value={actorData.actor_picture}
                onChange={(e) => setActorData({ ...actorData, actor_picture: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateActor}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the actor <strong>{selectedActor?.name}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteActor}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ActorList;
