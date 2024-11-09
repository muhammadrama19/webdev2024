import React, { useState, useEffect } from "react";
import {
    Container,
    Table,
    Form,
    Button,
    Modal,
    Col,
    Row,
    InputGroup,
    FormControl,
    Pagination,
    Spinner,
    Image
} from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import "./InputActor.scss";
import Icon from '../../../assets/Oval.svg';
import axios from 'axios';

const ActorManager = () => {
    const [actorData, setActorData] = useState({
        name: '',
        birthdate: '',
        country_name: '',
        actor_picture: ''
    });
    const [newActor, setNewActor] = useState({ country_name: "", name: "", birthdate: "", actor_picture: "" });
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCount, setShowCount] = useState(10);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actorToDelete, setActorToDelete] = useState(null);

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

    const checkCountryExists = async (countryName) => {
        try {
            const response = await axios.get(`http://localhost:8001/countries/${countryName}`, {
                withCredentials: true
            });
            return !!response.data;
        } catch (error) {
            console.error("Error checking country existence:", error);
            return false;
        }
    };

    const handleAddActor = async (e) => {
        e.preventDefault();

        const countryExists = await checkCountryExists(actorData.country_name);
        if (!countryExists) {
            alert("Country does not exist. Please add the country first.");
            return;
        }

        if (actorData.name.trim() && actorData.country_name.trim()) {
            try {
                const response = await axios.post('http://localhost:8001/actors', actorData, {
                    withCredentials: true
                });

                const data = await response.json();
                setActors((prevActors) => [...prevActors, data]);
            } catch (error) {
                console.error("Error adding actor:", error);
            }

            setNewActor({ country_name: "", name: "", birthdate: "", actor_picture: "" });
            setShowModal(false);
        } else {
            alert("All fields must be filled!");
        }
    };

    const handleDeleteActor = async () => {
        try {
            await axios.put(`http://localhost:8001/actors/delete/${actorToDelete.id}`, {}, {
                withCredentials: true
            });
            setActors(actors.filter(actor => actor.id !== actorToDelete.id));
            setShowDeleteModal(false);
            setActorToDelete(null);
        } catch (error) {
            console.error("Error deleting actor:", error);
        }
    };

    const handleEditActor = (id) => {
        setEditing(id);
        const actorToEdit = actors.find((actor) => actor.id === id);
        setActorData(actorToEdit);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (actorData.name && actorData.country_name && actorData.birthdate && actorData.actor_picture) {
            const updatedActor = {
                name: actorData.name,
                country_name: actorData.country_name,
                birthdate: actorData.birthdate,
                actor_picture: actorData.actor_picture
            };

            const countryExists = await checkCountryExists(actorData.country_name);
            if (!countryExists) {
                alert("Country does not exist. Please add the country first.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8001/actors/${editing}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedActor),
                });

                const data = await response.json();
                setActors((prevActors) =>
                    prevActors.map((actor) => (actor.id === editing ? data : actor))
                );
                setEditing(null);
                setActorData({ country_name: "", name: "", birthdate: "", actor_picture: "" });
                setShowModal(false);
            } catch (error) {
                console.error("Error saving edit:", error);
            }
        } else {
            alert("All fields must be filled!");
        }
    };

    const handleShowModal = () => {
        setIsEditing(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setActorData({ country_name: "", name: "", birthdate: "", actor_picture: "" });
    };

    const filteredActors = actors.filter((actor) =>
        (actor.name && actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.country_name && actor.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.birthdate && actor.birthdate.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastActor = currentPage * showCount;
    const indexOfFirstActor = indexOfLastActor - showCount;
    const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor);
    const totalPages = Math.ceil(filteredActors.length / showCount);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        let items = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                    {number}
                </Pagination.Item>
            );
        }
        return (
            <div className="d-flex justify-content-end">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} />
                    {items}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                </Pagination>
            </div>
        );
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <Container>
            <Container className="App">
                <h1 className="title">Actors Manager</h1>
            </Container>

            <Container className="d-flex justify-content-end">
                <Row className="justify-content-end">
                    <Col xs="auto" className="d-flex mb-4">
                        <InputGroup className="mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <FormControl
                                type="text"
                                placeholder="Search Actor, Country, or Birth Date..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs="auto" className="d-flex mb-4">
                        <Form.Select className="mb-4" value={showCount} onChange={(e) => setShowCount(e.target.value)} style={{ width: '80px', display: 'inline-block' }}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </Form.Select>
                    </Col>

                    <Col xs="auto" className="d-flex mb-4">
                        <Button
                            variant="success"
                            className="d-flex align-items-center w-auto px-4 py-2 mb-4"
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={handleShowModal}>
                            <FaPlus className="me-2" />
                            Add New Actor
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Actor" : "Add New Actor"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Actor Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={actorData.name}
                                onChange={(e) => setActorData({ ...actorData, name: e.target.value })}
                                placeholder="Enter actor name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Birth Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthdate"
                                value={formatDate(actorData.birthdate)}
                                onChange={(e) => setActorData({ ...actorData, birthdate: e.target.value })}
                                placeholderText="Select Birth Date"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country_name"
                                value={actorData.country_name}
                                onChange={(e) => setActorData({ ...actorData, country_name: e.target.value })}
                                placeholder="Enter country"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Picture</Form.Label>
                            <Form.Control
                                type="text"
                                name="actor_picture"
                                value={actorData.actor_picture}
                                placeholder="Enter Picture URL"
                                onChange={(e) => setActorData({ ...actorData, actor_picture: e.target.value })}
                            />
                            {actorData.actor_picture && (
                                <Image
                                    src={actorData.actor_picture}
                                    alt="Poster Preview"
                                    style={{ width: '150px', height: '225px' }}
                                    onError={() => setActorData({ ...actorData, actorData: "" })}
                                />
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={handleCloseModal}>
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

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Actor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the actor "{actorToDelete?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteActor}>Delete</Button>
                </Modal.Footer>
            </Modal>
            {
                loading ? (
                    <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
                ) : (
                    <>
                        <Container className="actor-table-wrapper">
                            <Table striped bordered hover className="actor-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Birth Date</th>
                                        <th>Country</th>
                                        <th>Picture</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentActors.map((actor) => (
                                        <tr key={actor.id}>
                                            <td>{actor.id}</td>
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
                                                {actor.actor_picture && actor.actor_picture !== "N/A" ? (
                                                    <img src={actor.actor_picture} alt={actor.name} className="actor-img" style={{ width: '50px', height: '75px' }} />
                                                ) : (
                                                    <img src={Icon} alt={actor.name} width={50} />
                                                )}
                                            </td>
                                            <td>
                                                <Container className="action-button">
                                                    <Button className="btn btn-sm btn-primary me-2" onClick={() => handleEditActor(actor.id)}>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setActorToDelete(actor);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Container>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                        {renderPagination()}
                    </>
                )
            }
        </Container>
    );
};

export default ActorManager;
