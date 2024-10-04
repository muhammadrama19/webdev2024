import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Modal, Pagination, Dropdown, Col } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import './InputAward.css';

const AwardsManager = () => {
    const [awards, setAwards] = useState([]);
    const [newAward, setNewAward] = useState({ country: '', year: '', award: '' });
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian
    const [showCount, setShowCount] = useState(10); // Items per page

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await fetch('http://localhost:8001/awards');
                const data = await response.json();
                setAwards(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching actors:", error);
                setLoading(false);
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

    // Function untuk filter drama berdasarkan search term (sebelum pagination)
    const filteredAwards = awards.filter((award) =>
        award.awards_name && award.awards_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        award.country_name && award.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAward = currentPage * showCount;
    const indexOfFirstAward = indexOfLastAward - showCount;
    const currentAwards = filteredAwards.slice(indexOfFirstAward, indexOfLastAward); // Paginate hasil pencarian
    const totalPages = Math.ceil(filteredAwards.length / showCount);

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
                <h1 className="title">Awards Manager</h1>
            </Container>
            {/* Form Section */}
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

                {/* Button to Add New Award */}
                <Button
                    variant="success"
                    className="d-flex align-items-center w-auto px-4 py-2"
                    style={{ whiteSpace: 'nowrap' }} // Ini mencegah teks tombol pecah ke baris lain
                    onClick={handleShowModal}>
                    <FaPlus className="me-2" />
                    Add New Award
                </Button>
            </Container>

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

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
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
                                {currentAwards.map((award) => (
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
                    {renderPagination()}
                </>
            )}
        </Container >
    );
};

export default AwardsManager;
