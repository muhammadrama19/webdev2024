import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import "../InputActor/InputActor.css"; 

const ActorManager = () => {
    const [actors, setActors] = useState([
        { id: 1, country: "Japan", name: "Takuya Kimura", birthDate: "19 Desember 1975", photo: "" },
        { id: 2, country: "Japan", name: "Yuko Takeuchi", birthDate: "19 Oktober 1977", photo: "" },
    ]);

    const [newActor, setNewActor] = useState({ country: "", name: "", birthDate: "", photo: "" });
    const [editing, setEditing] = useState(null);
    const [editActor, setEditActor] = useState({ country: "", name: "", birthDate: "", photo: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewActor((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddActor = () => {
        if (newActor.name.trim() && newActor.country.trim()) {
            setActors((prevActors) => [
                ...prevActors,
                { ...newActor, id: Date.now() }
            ]);
            setNewActor({ country: "", name: "", birthDate: "", photo: "" });
        }
    };

    const handleDeleteActor = (id) => {
        setActors((prevActors) => prevActors.filter((actor) => actor.id !== id));
    };

    const handleEditActor = (id) => {
        setEditing(id);
        const actorToEdit = actors.find((actor) => actor.id === id);
        setEditActor(actorToEdit);
    };

    const handleSaveEdit = () => {
        setActors((prevActors) =>
            prevActors.map((actor) => (actor.id === editing ? editActor : actor))
        );
        setEditing(null);
        setEditActor({ country: "", name: "", birthDate: "", photo: "" });
    };

    return (
        <Container className="mt-5">
            {/* Form Section */}
            <Row className="mb-4">
                <Col md={{ span: 8, offset: 2 }}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={(e) => { e.preventDefault(); handleAddActor(); }}>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="country"
                                                value={newActor.country}
                                                onChange={handleInputChange}
                                                placeholder="Enter country"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Actor Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={newActor.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter actor name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Birth Date</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="birthDate"
                                                value={newActor.birthDate}
                                                onChange={handleInputChange}
                                                placeholder="Enter birth date"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Upload Picture</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="photo"
                                                onChange={(e) =>
                                                    setNewActor((prev) => ({ ...prev, photo: e.target.files[0] }))
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button className="btn btn-primary me-2" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Table Section */}
            <Table striped bordered hover>
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
                    {actors.map((actor, index) => (
                        <tr key={actor.id}>
                            <td>{index + 1}</td>
                            <td>{actor.country}</td>
                            <td>{actor.name}</td>
                            <td>{actor.birthDate}</td>
                            <td>
                                {actor.photo ? (
                                    <img src={URL.createObjectURL(actor.photo)} alt={actor.name} width={50} />
                                ) : (
                                    <div style={{ width: 50, height: 50, backgroundColor: '#ddd' }} />
                                )}
                            </td>
                            <td>
                                {editing === actor.id ? (
                                    <>
                                        <Button variant="success" size="sm" onClick={handleSaveEdit}>
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button className="btn btn-sm btn-primary me-2" onClick={() => handleEditActor(actor.id)}>
                                            Edit
                                        </Button>
                                        <Button className="btn btn-sm btn-danger" onClick={() => handleDeleteActor(actor.id)}>
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

export default ActorManager;
