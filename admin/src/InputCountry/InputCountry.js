import React, { useState } from "react";
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
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
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setNewCountry("");
    };

    const handleAddCountry = () => {
        const trimmedCountry = newCountry.trim();

        if (trimmedCountry) {
            if (countries.some(country => country.name.toLowerCase() === trimmedCountry.toLowerCase())) {
                alert("Country already exists!");
            } else {
                setCountries([
                    ...countries,
                    {
                        id: countries.length + 1,
                        name: trimmedCountry,
                        isDefault: false,
                    },
                ]);
                setNewCountry("");
                handleCloseModal();
            }
        } else {
            alert("Country name cannot be empty or just spaces!");
        }
    };


    const handleDeleteCountry = (id) => {
        const country = countries.find((country) => country.id === id);
        if (country.isDefault) {
            alert("You cannot delete the default country. Please change the default country first.");
        } else {
            setCountries(countries.filter((country) => country.id !== id));
        }
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
        <Container className="input-country-container">
            {/* Form Section */}
            <Button variant="success" className="d-flex align-items-center ms-auto mb-3" onClick={handleShowModal}>
                <FaPlus className="me-2" />
                Add Country
            </Button>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Country</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); handleAddCountry(); }}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                value={newCountry}
                                onChange={(e) => setNewCountry(e.target.value)}
                                placeholder="Enter country name"
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
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleRenameCountry(country.id)}
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
                                            className="me-2"
                                            onClick={() => {
                                                setEditing(country.id);
                                                setEditName(country.name);
                                            }}
                                            disabled={editing !== null}
                                        >
                                            Rename
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleDeleteCountry(country.id)}
                                            disabled={editing !== null}
                                        >
                                            Delete
                                        </Button>
                                        {!country.isDefault && (
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleSetDefault(country.id)}
                                                disabled={editing !== null}
                                            >
                                                Set Default
                                            </Button>
                                        )}
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

export default CountryManager;
