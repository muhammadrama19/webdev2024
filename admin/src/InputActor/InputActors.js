import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal, Col, Dropdown, Pagination } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import "./InputActor.css";
import Icon from 'admin/public/assets/Oval.svg';
import DatePicker from "admin/node_modules/react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ActorManager = () => {
    const [newActor, setNewActor] = useState({ country_name: "", name: "", birthdate: "", actor_picture: "" });
    const [editing, setEditing] = useState(null);
    const [editActor, setEditActor] = useState({ country_name: "", name: "", birthdate: "", actor_picture: "" });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian
    const [showCount, setShowCount] = useState(10); // Items per page


    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await fetch('http://localhost:8001/actors');
                const data = await response.json();
                setActors(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching actors:", error);
                setLoading(false);
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
            setNewActor({ country_name: "", name: "", birthdate: "", actor_picture: "" });
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
            setEditActor({ country_name: "", name: "", birthdate: "", actor_picture: "" });
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
        if (isEditing) {
            // Reset the editing state and clear editActor data
            setEditActor({ country_name: "", name: "", birthdate: null, actor_picture: "" });
            setEditing(null);
        } else {
            // Reset the newActor state
            setNewActor({ country_name: "", name: "", birthdate: null, actor_picture: "" });
        }
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

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
        if (isEditing) {
            setEditActor((prev) => ({ ...prev, birthdate: formattedDate }));
        } else {
            setNewActor((prev) => ({ ...prev, birthdate: formattedDate }));
        }
    };

    // Function untuk filter actor berdasarkan search term (sebelum pagination)
    const filteredActors = actors.filter((actor) =>
        (actor.name && actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.country_name && actor.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.birthdate && actor.birthdate.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastActor = currentPage * showCount;
    const indexOfFirstActor = indexOfLastActor - showCount;
    const currentActors = filteredActors.slice(indexOfFirstActor, indexOfLastActor); // Paginate hasil pencarian
    const totalPages = Math.ceil(filteredActors.length / showCount);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Logic to show only 3 pages (current, previous, next)
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

    return (
        <Container>
            <Container className="App">
                <h1 className="title">Actors Manager</h1>
            </Container>

            <Container className="list-drama-header d-flex justify-content-between mb-3">
                <Container className="d-flex">
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Container>

                {/* Button to Add New Actor */}
                <Button
                    variant="success"
                    className="d-flex align-items-center w-auto px-4 py-2"
                    style={{ whiteSpace: 'nowrap' }} // Ini mencegah teks tombol pecah ke baris lain
                    onClick={handleShowModal}>
                    <FaPlus className="me-2" />
                    Add New Actor
                </Button>
            </Container>

            {/* Modal for Adding/Editing Actor */}
            < Modal show={showModal} onHide={handleCloseModal} centered >
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
                                value={isEditing ? editActor.country_name : newActor.country_name}
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
                            <DatePicker
                                selected={isEditing ? (editActor.birthdate ? new Date(editActor.birthdate) : null) : (newActor.birthdate ? new Date(newActor.birthdate) : null)}
                                onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                                className="form-control ms-2"
                                placeholderText="Select Birth Date"
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
            </Modal >
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {/* Table Section */}
                    < Container className="actor-table-wrapper" >
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
                                {currentActors.map((actor) => (
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
                    </Container >
                    {renderPagination()}
                </>
            )}
        </Container >

    );
};

export default ActorManager;
