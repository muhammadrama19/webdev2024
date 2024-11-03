import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal, Pagination, Dropdown, Col } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import "./InputGenres.css";

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [newGenre, setNewGenre] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian
    const [showCount, setShowCount] = useState(10); // Items per page

    // New state for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [genreToDelete, setGenreToDelete] = useState(null);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8001/genres');
                const data = await response.json();
                setGenres(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching actors:", error);
                setLoading(false);
            }
        };
        fetchGenres();
    }, []);

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
                alert("Genre already exists!");
            } else {
                try {
                    const response = await fetch('http://localhost:8001/genres', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: trimmedGenre }),
                    });

                    const data = await response.json();
                    setGenres([...genres, data]);
                    setNewGenre("");
                    handleCloseModal();
                } catch (error) {
                    console.error("Error adding genre:", error);
                }
            }
        } else {
            alert("Genre name cannot be empty or just spaces!");
        }
    };


    const handleDeleteGenre = async () => {
        if (genreToDelete) {
            try {
                await fetch(`http://localhost:8001/genres/${genreToDelete.id}`, {
                    method: 'DELETE',
                });
                setGenres(genres.filter((genre) => genre.id !== genreToDelete.id));
                setShowDeleteModal(false);
                setGenreToDelete(null);
            } catch (error) {
                console.error("Error deleting genre:", error);
            }
        }
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
                alert("Genre already exists!");
            } else {
                try {
                    await fetch(`http://localhost:8001/genres/${editing}`, {
                        method: 'PUT',
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
                    setEditing(null);
                    setShowModal(false);
                    setEditName("");
                } catch (error) {
                    console.error("Error updating genre:", error);
                }
            }
        }
    };

    // Function untuk filter drama berdasarkan search term (sebelum pagination)
    const filteredGenres = genres.filter((genre) =>
        genre.name && genre.name.toLowerCase().includes(searchTerm.toLowerCase())
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

                {/* Button to Add New Genre */}
                <Button
                    variant="success"
                    className="d-flex align-items-center w-auto px-4 py-2"
                    style={{ whiteSpace: 'nowrap' }} // Ini mencegah teks tombol pecah ke baris lain
                    onClick={handleShowModal}>
                    <FaPlus className="me-2" />
                    Add New Genre
                </Button>
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
                    Are you sure you want to delete the genre "{genreToDelete?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteGenre}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {loading ? (
                <p>Loading data...</p>
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
                                                        setGenreToDelete(genre);
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
