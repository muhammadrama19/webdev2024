import React, { useState } from "react";
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import "./InputGenres.css";

const GenreManager = () => {
    const [genres, setGenres] = useState([
        { id: 1, name: "Romance" },
        { id: 2, name: "Drama" },
        { id: 3, name: "Action" },
    ]);
    const [newGenre, setNewGenre] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setNewGenre("");
    };

    const handleAddGenre = () => {
        const trimmedGenre = newGenre.trim();

        if (trimmedGenre) {
            if (genres.some(genres => genres.name.toLowerCase() === trimmedGenre.toLowerCase())) {
                alert("Genre already exists!");
            } else {
                setGenres([
                    ...genres,
                    {
                        id: genres.length + 1,
                        name: trimmedGenre,
                    },
                ]);
                setNewGenre("");
                handleCloseModal();
            }
        } else {
            alert("Country name cannot be empty or just spaces!");
        }
    };

    const handleDeleteGenre = (id) => {
        setGenres(genres.filter((genres) => genres.id !== id));
    };

    const handleRenameGenre = (id) => {
        if (editName.trim()) {
            setGenres(
                genres.map((genre) =>
                    genre.id === id ? { ...genre, name: editName } : genre
                )
            );
            setEditing(null);
            setEditName("");
        }
    };

    return (
        <Container className="input-genre-container">
            {/* Form Section */}
            <Button variant="success" className="d-flex align-items-center ms-auto mb-3" onClick={handleShowModal}>
                <FaPlus className="me-2" />
                Add Genre
            </Button>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Genre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form inline onSubmit={(e) => { e.preventDefault(); handleAddGenre(); }}>
                        <Form.Group className="mb-3">
                            <Form.Label className="me-2">Genre</Form.Label>
                            <Form.Control
                                type="text"
                                value={newGenre}
                                onChange={(e) => setNewGenre(e.target.value)}
                                placeholder="Enter genre name"
                                className="me-2"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="primary" className="mt-2" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Table Section */}
            <Table className="table table-striped" striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Genre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {genres.map((country, index) => (
                        <tr key={country.id} className={country.isDefault ? "table-danger" : ""}>
                            <td>{index + 1}</td>
                            <td>
                                {editing === country.id ? (
                                    <Form.Control
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                ) : (
                                    country.name
                                )}
                            </td>
                            <td>
                                {editing === country.id ? (
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleRenameGenre(country.id)}
                                            className="me-2"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setEditing(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(country.id);
                                                setEditName(country.name);
                                            }}
                                            className="me-2"
                                            disabled={editing !== null}
                                        >
                                            Rename
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteGenre(country.id)}
                                            className="me-2"
                                            disabled={editing !== null}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default GenreManager;
