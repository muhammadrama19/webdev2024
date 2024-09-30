import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import "./InputActor.css";
import Icon from 'admin/public/assets/Oval.svg';

const ActorManager = () => {
    const [newActor, setNewActor] = useState({ country: "", name: "", birthDate: "", photo: "" });
    const [editing, setEditing] = useState(null);
    const [editActor, setEditActor] = useState({ country: "", name: "", birthDate: "", photo: "" });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [actors, setActors] = useState([]);


    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await fetch('http://localhost:8001/actors');
                const data = await response.json();
                setActors(data);
            } catch (error) {
                console.error("Error fetching actors:", error);
            }
        };
        fetchActors();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setEditActor((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewActor((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddActor = async (e) => {
        e.preventDefault();
        if (newActor.name.trim() && newActor.country.trim()) {
            try {
                const response = await fetch('http://localhost:8001/actors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...newActor, id: Date.now() }),
                });
                const data = await response.json();
                setActors((prevActors) => [...prevActors, data]);
            } catch (error) {
                console.error("Error adding actor:", error);
            }
            setNewActor({ country: "", name: "", birthDate: "", photo: "" });
            setShowModal(false);
        } else {
            alert("All fields must be filled!");
        }
    };

    const handleDeleteActor = async (id) => {
        try {
            await fetch(`http://localhost:8001/actors/${id}`, {
                method: 'DELETE',
            });
            setActors((prevActors) => prevActors.filter((actor) => actor.id !== id));
        } catch (error) {
            console.error("Error deleting actor:", error);
        }
    };

    const handleEditActor = (id) => {
        setEditing(id);
        const actorToEdit = actors.find((actor) => actor.id === id);
        setEditActor(actorToEdit);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8001/actors/${editing}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editActor),
            });
            const updatedActor = await response.json();
            setActors((prevActors) =>
                prevActors.map((actor) => (actor.id === editing ? updatedActor : actor))
            );
            setEditing(null);
            setEditActor({ country: "", name: "", birthDate: "", photo: "" });
            setShowModal(false);
        } catch (error) {
            console.error("Error saving edit:", error);
        }
    };

    const handleShowModal = () => {
        setIsEditing(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const photoUrl = URL.createObjectURL(file);

            if (isEditing) {
                setEditActor((prev) => ({
                    ...prev,
                    photo: photoUrl,
                }));
            } else {
                setNewActor((prev) => ({
                    ...prev,
                    photo: photoUrl,
                }));
            }
        } else {
            alert('Please upload a valid image file.');
        }
    };

    return (
        <Container>
            <Container className="App">
                <h1 className="title">Actors Manager</h1>
            </Container>
            {/* Button to Add New Actor */}
            <Button
                variant="success"
                className="d-flex align-items-center ms-auto mb-3"
                onClick={handleShowModal}>
                <FaPlus className="me-2" />
                Add New Actor
            </Button>

            {/* Modal for Adding/Editing Actor */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Actor" : "Add New Actor"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={isEditing ? editActor.country : newActor.country}
                                onChange={handleInputChange}
                                placeholder="Enter country"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Actor Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={isEditing ? editActor.name : newActor.name}
                                onChange={handleInputChange}
                                placeholder="Enter actor name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Birth Date</Form.Label>
                            <Form.Control
                                type="text"
                                name="birthDate"
                                value={isEditing ? editActor.birthDate : newActor.birthDate}
                                onChange={handleInputChange}
                                placeholder="Enter birth date"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Picture</Form.Label>
                            <Form.Control
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            {/* Preview Image */}
                            {isEditing && editActor.actor_picture && (
                                <div className="mt-2">
                                    <img src={editActor.actor_picture} alt="Preview" width={100} />
                                </div>
                            )}
                            {!isEditing && newActor.actor_picture && (
                                <div className="mt-2">
                                    <img src={newActor.actor_picture} alt="Preview" width={100} />
                                </div>
                            )}
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
                        onClick={isEditing ? handleSaveEdit : handleAddActor}
                        style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
                    >
                        {isEditing ? "Save Changes" : "Add Actor"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Table Section */}
            <Container className="actor-table-wrapper">
                <Table striped bordered hover className="actor-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Countries</th>
                            <th>Actor Name</th>
                            <th>Birth Date</th>
                            <th>Photos</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actors.map((actor) => (
                            <tr key={actor.id}>
                                <td>{actor.id}</td>
                                <td>{actor.country_name}</td>
                                <td>{actor.name}</td>
                                <td>
                                    {new Date(actor.birthdate).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </td>

                                <td>
                                    {actor.actor_picture && actor.actor_picture !== "N/A" ? (
                                        <img src={actor.actor_picture} alt={actor.name} width={50} />
                                    ) : (
                                        <img src={Icon} alt={actor.name} width={50} />
                                    )}
                                </td>
                                <td>
                                    <Container className="action-button">
                                        <Button className="btn btn-sm btn-primary me-2" onClick={() => handleEditActor(actor.id)}>
                                            Edit
                                        </Button>
                                        <Button className="btn btn-sm btn-danger" onClick={() => handleDeleteActor(actor.id)}>
                                            Delete
                                        </Button>
                                    </Container>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};

export default ActorManager;
