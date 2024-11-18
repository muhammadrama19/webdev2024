import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal, Pagination, Col, Row, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";
import "./InputGenres.css";
import Swal from "sweetalert2";

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCount, setShowCount] = useState(10);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        fetchGenres();
    }, [showCount]);

    const fetchGenres = async () => {
        try {
            const response = await fetch("http://localhost:8001/genres");
            const data = await response.json();
            setGenres(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        if (isEditing) {
            setEditName(e.target.value);
        } else {
            setNewGenre(e.target.value);
        }
    };

    const handleAddGenre = async () => {
        const trimmedGenre = newGenre.trim();

        if (trimmedGenre) {
            if (genres.some(genre => genre.name.toLowerCase() === trimmedGenre.toLowerCase())) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Genre already exists!",
                });
            } else {
                try {
                    const response = await axios.post('http://localhost:8001/genres',
                        { name: trimmedGenre },
                        {
                            withCredentials: true, // Enable cookies to be sent
                        });
                    setGenres([...genres, response.data]);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Genre added successfully!",
                    });
                    setNewGenre("");
                    handleCloseModal();

                } catch (error) {
                    console.error("Error adding genre:", error);
                }
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Genre name cannot be empty!",
            });
        }
    };

    const handleDeleteGenre = async () => {
        const url = `http://localhost:8001/genres/delete/${selectedGenre.id}`;

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Ensure cookies are sent with the request
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Genre deleted successfully!",
                })
                fetchGenres(); // Refresh genres list after deletion
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred while deleting the genre. Please try again later or check relations in the database.",
                });
            }
        } catch (error) {
            console.error("Error soft deleting genre:", error);
        }
        setShowDeleteModal(false);
        setSelectedGenre(null);
    };

    const handleEditGenre = (id) => {
        setEditing(id);
        const genre = genres.find((genre) => genre.id === id);
        setEditName(genre);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleRenameGenre = async (e) => {
        e.preventDefault();

        if (editName.trim()) {
            if (genres.some(genre => genre.name.toLowerCase() === editName.toLowerCase())) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Genre already exists!",
                });

            } else {
                try {
                    await fetch(`http://localhost:8001/genres/update/${editing}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: editName }),
                    });
                    setGenres(
                        genres.map((genre) =>
                            genre.id === editing ? { ...genre, name: editName } : genre
                        )
                    );
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Genre updated successfully!",
                    });
                    setEditing(null);
                    setIsEditing(false);
                    setShowModal(false);
                    setEditName("");
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to update genre!",
                    });
                }
            }
        }
    };

    // Function untuk filter drama berdasarkan search term (sebelum pagination)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset ke halaman pertama saat pencarian berubah
    };

    const filteredGenres = genres.filter((genre) =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastGenre = currentPage * showCount;
    const indexOfFirstGenre = indexOfLastGenre - showCount;
    const currentGenres = filteredGenres.slice(indexOfFirstGenre, indexOfLastGenre); // Paginate hasil pencarian
    const totalPages = Math.ceil(filteredGenres.length / showCount);

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
                <h1 className="title">Genres Manager</h1>
            </Container>
            {/* Form Section */}
            <Container className="d-flex justify-content-end">
                <Row className="justify-content-end">
                    <Col xs="auto" className="d-flex mb-4">
                    <InputGroup className="mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <FormControl
                                type="text"
                                placeholder="Search Genre..."
                                value={searchTerm}
                                onChange={handleSearchChange}
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

                    {/* Button to Add New Genre */}
                    <Col xs="auto" className="d-flex mb-4">
                        <Button
                            variant="success"
                            className="d-flex align-items-center w-auto px-4 py-2 mb-4"
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={handleShowModal}>
                            <FaPlus className="me-2" />
                            Add New Genre
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Genre" : "Add New Genre"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="me-2">Genre</Form.Label>
                            <Form.Control
                                type="text"
                                value={isEditing ? editName.name : newGenre.name}
                                onChange={handleInputChange}
                                placeholder="Enter genre name"
                            />
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
                        onClick={isEditing ? handleRenameGenre : handleAddGenre}
                        style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
                    >
                        {isEditing ? "Save Changes" : "Add Genre"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Genre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the genre "{selectedGenre?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteGenre}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {loading ? (
                <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
            ) : (
                <>
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
                                {currentGenres.map((genre) => (
                                    <tr key={genre.id}>
                                        <td>{genre.id}</td>
                                        <td>{genre.name}</td>
                                        <td>
                                            <Container className="action-button">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditGenre(genre.id)}
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedGenre(genre);
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
            )}
        </Container>
    );
};

export default GenreManager;
