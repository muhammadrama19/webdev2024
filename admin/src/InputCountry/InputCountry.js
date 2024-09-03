import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import "./InputCountry.css";

const CountryManager = () => {
    const [countries, setCountries] = useState([
        { id: 1, name: "Japan", isDefault: true },
        { id: 2, name: "Korea", isDefault: false },
        { id: 3, name: "China", isDefault: false },
    ]);
    const [newCountry, setNewCountry] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");

    const handleAddCountry = () => {
        if (newCountry.trim()) {
            setCountries([
                ...countries,
                {
                    id: countries.length + 1,
                    name: newCountry,
                    isDefault: false,
                },
            ]);
            setNewCountry("");
        }
    };

    const handleDeleteCountry = (id) => {
        setCountries(countries.filter((country) => country.id !== id));
    };

    const handleRenameCountry = (id) => {
        if (editName.trim()) {
            setCountries(
                countries.map((country) =>
                    country.id === id ? { ...country, name: editName } : country
                )
            );
            setEditing(null);
            setEditName("");
        }
    };

    const handleSetDefault = (id) => {
        setCountries(
            countries.map((country) =>
                country.id === id
                    ? { ...country, isDefault: true }
                    : { ...country, isDefault: false }
            )
        );
    };

    return (
        <Container className="mt-5">
            {/* Form Section */}
            <Row className="mb-4">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Form inline onSubmit={(e) => { e.preventDefault(); handleAddCountry(); }}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="me-2">Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newCountry}
                                        onChange={(e) => setNewCountry(e.target.value)}
                                        placeholder="Enter country name"
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
                    {countries.map((country, index) => (
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
                                        onClick={() => handleRenameCountry(country.id)}
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
                                    onClick={() => handleDeleteCountry(country.id)}
                                    className="me-2"
                                >
                                    Delete
                                </Button>
                                {!country.isDefault && (
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleSetDefault(country.id)}
                                    >
                                        Set Default
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default CountryManager;
