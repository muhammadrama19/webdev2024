import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import "./InputGenres.css";

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8001/genres');
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error("Error fetching actors:", error);
            }
        };
        fetchGenres();
    }, []);

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
            alert("Genre name cannot be empty or just spaces!");
        }
    };

    const handleDeleteGenre = (id) => {
        setGenres(genres.filter((genres) => genres.id !== id));
    };

    const handleRenameGenre = (id) => {
        if (editName.trim()) {
            setGenres(
                genres.map((genre) =>
                    genres.id === id ? { ...genre, name: editName } : genre
                )
            );
            setEditing(null);
            setEditName("");
        }
    };

    return (
        <Container>
            <Container className="App">
                <h1 className="title">Genres Manager</h1>
            </Container>
            {/* Form Section */}
            <Button variant="success" className="d-flex align-items-center ms-auto mb-3" onClick={handleShowModal}>
                <FaPlus className="me-2" />
                Add New Genre
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
            <Container className="genre-table-wrapper">
                <Table className="genre-table" striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Genre</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres.map((genre) => (
                            <tr key={genre.id}>
                                <td>{genre.id}</td>
                                <td>
                                    {editing === genre.id ? (
                                        <Form.Control
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    ) : (
                                        genre.name
                                    )}
                                </td>
                                <td>
                                    <Container className="action-button">
                                        {editing === genre.id ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleRenameGenre(genre.id)}
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
                                                        setEditing(genre.id);
                                                        setEditName(genre.name);
                                                    }}
                                                    className="me-2"
                                                    disabled={editing !== null}
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteGenre(genre.id)}
                                                    className="me-2"
                                                    disabled={editing !== null}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
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

export default GenreManager;
