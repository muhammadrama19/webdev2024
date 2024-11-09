import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Modal, Pagination, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import "./InputCountry.scss";
import Swal from "sweetalert2";

const CountryManager = () => {
    const [countries, setCountries] = useState([]);
    const [newCountry, setNewCountry] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [showCount, setShowCount] = useState(10); 
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://localhost:8001/countries', {
                    credentials: 'include'
                });
                const data = await response.json();
                setCountries(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching countries:", error);
                setLoading(false);
            }
        };
        fetchCountries();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setNewCountry("");
    };

    const handleInputChange = (e) => {
        if (isEditing) {
            setEditName(e.target.value);
        } else {
            setNewCountry(e.target.value);
        }
    };

    const handleAddCountry = async () => {
        const trimmedCountry = newCountry.trim();

        if (trimmedCountry) {
            if (countries.some(country => country.country_name.toLowerCase() === trimmedCountry.toLowerCase())) {
                Swal.fire({
                    icon: "error",
                    title: "Country already exists!",
                    text: "The country you are trying to add already exists in the database.",      
                });
            } else {
                try {
                    const response = await fetch('http://localhost:8001/countries', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ country_name: trimmedCountry }),
                        credentials: 'include',
                    });

                    const data = await response.json();
                    setCountries([...countries, data]);
                    setNewCountry("");
                    handleCloseModal();
                    Swal.fire({
                        icon: "success",
                        title: "Country added!",
                        text: "The country has been added successfully.",
                    });
                } catch (error) {
                    console.error("Error adding country:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Failed to add country!",
                        text: "An error occurred while adding the country. Please try again later.",
                    });
                }
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Country name cannot be empty!",
                text: "Please enter a valid country name.",
            });
        }
    };
    const handleDeleteCountry = async () => {
        try {
            const response = await fetch(`http://localhost:8001/countries/delete/${selectedCountry.id}`, {
                method: 'PUT', // Use PUT method for soft delete
                headers: { "Content-Type": "application/json" },
                credentials: 'include', // Include credentials (cookies)
            });
            if (response.ok) {
                setCountries((prevCountries) => prevCountries.filter((country) => country.id !== selectedCountry.id));
                setShowDeleteModal(false);
                setSelectedCountry(null);
                Swal.fire({
                    icon: "success",
                    title: "Country deleted!",
                    text: "The country has been deleted successfully.",
                });
            } else {
                console.error("Failed to delete country:", response.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Failed to delete country!",
                    text: "An error occurred while deleting the country. Please try again later or contact support.",
                });
            }
        } catch (error) {
            console.error("Error deleting country:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to delete country!",
                text: "An error occurred while deleting the country. Please try again later or contact support.",
            });
        }
    };    

    const handleEditCounry = (id) => {
        setEditing(id);
        const country = countries.find((country) => country.id === id);
        setEditName(country);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleRenameCountry = async (e) => {
        e.preventDefault();

        if (editName.trim()) {
            if (countries.some(country => country.country_name.toLowerCase() === editName.toLowerCase())) {
                Swal.fire({
                    icon: "error",
                    title: "Country already exists!",
                    text: "The country you are trying to rename already exists in the database.",
                })
            } else {
                try {
                    await fetch(`http://localhost:8001/countries/${editing}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ country_name: editName }),
                    });
                    setCountries(
                        countries.map((country) =>
                            country.id === editing ? { ...country, country_name: editName } : country
                        )
                    );
                    setEditing(null);
                    setShowModal(false);
                    setEditName("");
                    Swal.fire({
                        icon: "success",
                        title: "Country renamed!",
                        text: "The country has been renamed successfully.",
                    });
                } catch (error) {
                    console.error("Error updating country:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Failed to rename country!",
                        text: "An error occurred while renaming the country. Please try again later.",
                    });
                }
            }
        }
    };

    // Function untuk filter drama berdasarkan search term (sebelum pagination)
    const filteredCountries = countries.filter((country) =>
        country.country_name && country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCountry = currentPage * showCount;
    const indexOfFirstCountry = indexOfLastCountry - showCount;
    const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry); // Paginate hasil pencarian
    const totalPages = Math.ceil(filteredCountries.length / showCount);

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
                <h1 className="title">Country Manager</h1>
            </Container>
            {/* Form Section */}
            <Container className="d-flex justify-content-end">
                <Row className="justify-content-end">
                    <Col xs="auto" className="d-flex mb-4">
                        <InputGroup className="mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <FormControl
                                type="text"
                                placeholder="Search Country..."
                                aria-label="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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

                    {/* Button to Add New Country */}
                    <Col xs="auto" className="d-flex mb-4">
                        <Button
                            variant="success"
                            className="d-flex align-items-center w-auto px-4 py-2 mb-4"
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={handleShowModal}>
                            <FaPlus className="me-2" />
                            Add New Country
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Country" : "Add New Country"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                value={isEditing ? editName.country_name : newCountry.name}
                                onChange={handleInputChange}
                                placeholder="Enter country name"
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
                        onClick={isEditing ? handleRenameCountry : handleAddCountry}
                        style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
                    >
                        {isEditing ? "Save Changes" : "Add Country"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the country "{selectedCountry?.country_name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteCountry}>Delete</Button>
                </Modal.Footer>
            </Modal>


            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {/* Table Section */}
                    <Container className="country-table-wrapper">
                        <Table className="country-table" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Country</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCountries.map((country) => (
                                    <tr key={country.id}>
                                        <td>{country.id}</td>
                                        <td>{country.country_name}</td>
                                        <td>
                                            <Container className="action-button">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditCounry(country.id)}
                                                >
                                                    Rename
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setSelectedCountry(country);
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
        </Container >
    );
};

export default CountryManager;

