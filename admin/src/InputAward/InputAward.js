import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import './InputAward.css';

const AwardsManager = () => {
    const [awards, setAwards] = useState([]);
    const [newAward, setNewAward] = useState({ country: '', year: '', award: '' });
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await fetch('http://localhost:8001/awards');
                const data = await response.json();
                setAwards(data);
            } catch (error) {
                console.error("Error fetching actors:", error);
            }
        };
        fetchAwards();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setNewAward({ country: '', year: '', award: '' });
        setEditing(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAward({ ...newAward, [name]: value });
    };

    const handleAddAward = () => {
        if (newAward.country && newAward.year && newAward.award) {
            if (editing !== null) {
                setAwards(awards.map((entry) =>
                    entry.id === editing ? { ...entry, ...newAward } : entry
                ));
                setEditing(null);
            } else {
                setAwards([
                    ...awards,
                    { id: awards.length + 1, ...newAward }
                ]);
            }
            handleCloseModal();
        } else {
            alert("All fields must be filled!");
        }
    };

    const handleEdit = (id) => {
        const entry = awards.find((entry) => entry.id === id);
        setNewAward(entry);
        setEditing(id);
        handleShowModal();
    };

    const handleDelete = (id) => {
        setAwards(awards.filter((entry) => entry.id !== id));
    };

    return (
        <Container>
            <Container className="App">
                <h1 className="title">Awards Manager</h1>
            </Container>
            {/* Form Section */}
            <Button
                variant="success"
                className="d-flex align-items-center ms-auto mb-3"
                onClick={handleShowModal}>
                <FaPlus className="me-2" />
                Add New Award
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing !== null ? 'Edit Award' : 'Add New Award'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => { e.preventDefault(); handleAddAward(); }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={newAward.country}
                                onChange={handleChange}
                                placeholder="Enter country"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                                type="number"
                                name="year"
                                value={newAward.year}
                                onChange={handleChange}
                                placeholder="Enter year"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Award</Form.Label>
                            <Form.Control
                                type="text"
                                name="award"
                                value={newAward.award}
                                onChange={handleChange}
                                placeholder="Enter award"
                            />
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
                        style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
                        onClick={handleAddAward}>
                        {editing !== null ? 'Save Changes' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Table Section */}
            <Container className='award-table-wrapper'>
                <Table className="award-table" striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Country</th>
                            <th>Year</th>
                            <th>Award</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awards.map((award) => (
                            <tr key={award.id}>
                                <td>{award.id}</td>
                                <td>{award.country_name}</td>
                                <td>{award.year}</td>
                                <td>{award.awards_name}</td>
                                <td>
                                    <Container className="action-button">
                                        <Button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => handleEdit(award.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(award.id)}
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
        </Container >
    );
};

export default AwardsManager;
