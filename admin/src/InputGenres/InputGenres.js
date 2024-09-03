import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import "./InputGenres.css";

const GenreManager = () => {
    const [Genres, setGenres] = useState([
        { id: 1, name: "Romance" },
        { id: 2, name: "Drama" },
        { id: 3, name: "Action" },
    ]);
    const [newGenres, setNewGenres] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");

    const handleAddGenre = () => {
        if (newGenres.trim()) {
            setGenres([
                ...Genres,
                {
                    id: Genres.length + 1,
                    name: newGenres,
                    isDefault: false,
                },
            ]);
            setNewGenres("");
        }
    };

    const handleDeleteGenre = (id) => {
        setGenres(Genres.filter((country) => country.id !== id));
    };

    const handleRenameGenre = (id) => {
        if (editName.trim()) {
            setGenres(
                Genres.map((genre) =>
                    genre.id === id ? { ...genre, name: editName } : genre
                )
            );
            setEditing(null);
            setEditName("");
        }
    };

    return (
        <Container className="mt-5">
            {/* Form Section */}
            <Row className="mb-4">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Form inline onSubmit={(e) => { e.preventDefault(); handleAddGenre(); }}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="me-2">Genre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newGenres}
                                        onChange={(e) => setNewGenres(e.target.value)}
                                        placeholder="Enter genre name"
                                        className="me-2"
                                    />
                                    <Button className="btn btn-primary mt-2" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
                                        Submit
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Table Section */}
            <Table className="table table-striped" striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Genres.map((country, index) => (
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
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleRenameGenre(country.id)}
                                        className="me-2"
                                    >
                                        Save
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            setEditing(country.id);
                                            setEditName(country.name);
                                        }}
                                        className="me-2"
                                    >
                                        Rename
                                    </Button>
                                )}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteGenre(country.id)}
                                    className="me-2"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default GenreManager;
