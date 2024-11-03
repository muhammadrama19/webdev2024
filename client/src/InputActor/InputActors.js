import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form, InputGroup, FormControl, Image } from 'react-bootstrap';
import { FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import PaginationCustom from "../components/pagination/pagination"; // Import the custom pagination component
import './InputActor.scss';

const ActorList = () => {
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddorEditModal, setShowAddorEditModal] = useState(false);
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

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleShowAddorEdit = (actor) => {
    setActorData({
      name: actor.name,
      birthdate: formatDate(actor.birthdate),
      country_name: actor.country_name,
      actor_picture: actor.actor_picture
    });
    setSelectedActor(actor);
    setShowAddorEditModal(true);
    if (isEditing) {
      setIsEditing(false);
    }
  };

  const handleShowDelete = (actor) => {
    setSelectedActor(actor);
    setShowDeleteModal(true);
  };

  const checkCountryExists = async (countryName) => {
    try {
      const response = await axios.get(`http://localhost:8001/countries/${countryName}`);
      return !!response.data; // Return true if data is found, false otherwise
    } catch (error) {
      console.error("Error checking country existence:", error);
      return false;
    }
  };

  const handleAddActor = async (e) => {
    e.preventDefault();

    // Check if country exists in the backend
    const countryExists = await checkCountryExists(actorData.country_name);
    console.log(actorData.country_name);
    console.log(countryExists);
    if (!countryExists) {
      alert("Country does not exist. Please add the country first.");
      return;
    }

    if (actorData.name.trim() && actorData.country_name.trim()) {
      // Create FormData to send file and other actor data
      const formData = new FormData();
      formData.append('name', actorData.name);
      formData.append('country_name', actorData.country_name);
      formData.append('birthdate', actorData.birthdate);
      formData.append('actor_picture', actorData.actor_picture);

      try {
        const response = await axios.post('http://localhost:8001/actors', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setActors((prevActors) => [...prevActors, response.data]);
      } catch (error) {
        console.error("Error adding actor:", error);
      }

      // Clear the form and reset state
      setActorData({ country_name: "", name: "", birthdate: "", actor_picture: "" });
      setShowAddorEditModal(false);
    } else {
      alert("All fields must be filled!");
    }
  };

  const handleUpdateActor = async () => {
    try {
      const response = await axios.put(`http://localhost:8001/actors/${selectedActor.id}`, actorData);
      setActors(actors.map(actor => actor.id === selectedActor.id ? { ...actor, ...actorData } : actor));
      setShowAddorEditModal(false);
      setSelectedActor(null);
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  const handleDeleteActor = async () => {
    try {
      await axios.delete(`http://localhost:8001/actors/${selectedActor.id}`);
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
      <Container className="d-flex justify-content-between align-items-center">
        <InputGroup className="mb-4 me-4" style={{ maxWidth: '400px' }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Search actors..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button
          variant="success"
          className="d-flex align-items-center w-auto px-2 py-2 mb-4"
          style={{ whiteSpace: 'nowrap' }}
          onClick={handleShowAddorEdit}>
          <FaPlus className="me-2" />
          Add New Actor
        </Button>
      </Container>
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
                <td>
                  {new Date(actor.birthdate).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td>{actor.country_name}</td>
                <td>
                  <Container className="d-flex justify-content-center">
                    <Button variant="info" onClick={() => handleShowDetail(actor)} style={{ marginRight: '10px' }}>
                      Details
                    </Button>
                    <Button variant="warning" onClick={() => { handleShowAddorEdit(actor); setIsEditing(true) }} style={{ marginRight: '10px' }}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleShowDelete(actor)}>
                      Delete
                    </Button>
                  </Container>
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
          <p><strong>Birthdate:</strong> {new Date(selectedActor?.birthdate).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}</p>
          <p><strong>Country:</strong> {selectedActor?.country_name}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Add or Edit Modal */}
      <Modal
        show={showAddorEditModal}
        onHide={() => setShowAddorEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Actor" : "Add New Actor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formActorName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={actorData.name}
                onChange={(e) => setActorData({ ...actorData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorBirthdate" className="mb-3">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="date"
                value={actorData.birthdate}
                onChange={(e) => setActorData({ ...actorData, birthdate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorCountry" className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={actorData.country_name}
                onChange={(e) => setActorData({ ...actorData, country_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formActorPicture" className="mb-3">
              <Form.Label>Picture URL</Form.Label>
              <Form.Control
                type="text"
                value={actorData.actor_picture}
                onChange={(e) => setActorData({ ...actorData, actor_picture: e.target.value })}
              />
              {actorData.actor_picture && (
                <Image
                  src={actorData.actor_picture}
                  alt="Poster Preview"
                  style={{ width: '100px', height: '150px' }}
                  onError={() => setActorData({ ...actorData, actor_picture: "" })} // Hide preview if URL is invalid
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddorEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={isEditing ? handleUpdateActor : handleAddActor}>Save Changes</Button>
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
