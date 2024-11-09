import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Modal, Pagination, Row, Col, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import './InputAward.css';
import Swal from 'sweetalert2';

const AwardsManager = () => {
    const [awards, setAwards] = useState([]);
    const [newAward, setNewAward] = useState({ country_name: '', awards_years: '', awards_name: '' });
    const [editing, setEditing] = useState(null);
    const [editAward, setEditAward] = useState({ country_name: '', awards_years: '', awards_name: '' });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian
    const [showCount, setShowCount] = useState(10); // Items per page

    // New state for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [awardToDelete, setAwardToDelete] = useState(null);

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await fetch('http://localhost:8001/awards', {
                    credentials: 'include'
                });
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

    const handleShowModal = () => {
        setIsEditing(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (isEditing) {
            // Reset the editing state and clear editActor data
            setEditAward({ country_name: '', awards_years: '', awards_name: '' });
        } else {
            // Reset the newActor state
            setNewAward({ country_name: '', awards_years: '', awards_name: '' });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'awards_years' && (value.length > 4 || isNaN(value))) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid year',
                text: 'Year must be exactly 4 digits and must be a number',
            });
            return;
        }

        if (isEditing) {
            setEditAward((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewAward((prev) => ({ ...prev, [name]: value }));
        }
    };

    const checkCountryExists = async (countryName) => {
        try {
            const response = await fetch(`http://localhost:8001/countries/${countryName}`);
            if (!response.ok) {
                return false; // Return false if country is not found (404)
            }
            const data = await response.json();
            return !!data; // Return true if data is found, false otherwise
        } catch (error) {
            console.error("Error checking country existence:", error);
            return false;
        }
    };

    const handleAddAward = async (e) => {
        e.preventDefault();

        // Check if country exists in the backend
        const countryExists = await checkCountryExists(newAward.country_name);
        if (!countryExists) {
            Swal.fire({
                icon: 'error',
                title: 'Country not found',
                text: 'Country does not exist. Please add the country first.',  
            });
            return;
        }

        // Cek apakah tahun berisi tepat 4 angka
        if (newAward.awards_years.length !== 4 || isNaN(newAward.awards_years)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid year',
                text: 'Year must be exactly 4 digits and must be a number',
            });
            return;
        }


        if (parseInt(newAward.awards_years) < 1950) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid year',
                text: 'Year must be greater than or equal to 1950',
            });
            return;
        }

        if (newAward.awards_name && newAward.country_name && newAward.awards_years) {
            const newAwardData = {
                awards_name: newAward.awards_name,
                country_name: newAward.country_name,
                awards_years: newAward.awards_years,
            };

            try {
                const response = await fetch('http://localhost:8001/awards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAwardData),
                    credentials: 'include'
                });

                const data = await response.json();
                setAwards((prevAwards) => [...prevAwards, data]);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Award added successfully',
                    timer: 3000,
                });
            } catch (error) {
                console.error("Error adding award:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while adding the award. Please try again later.',
                    timer: 3000,
                })
            }
            setNewAward({ country_name: '', awards_years: '', awards_name: '' });
            handleCloseModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'All fields must be filled',
                text: 'Please fill all fields before submitting',
                timer: 3000,
            });
        }
    };

    const handleEditAward = async (e) => {
        e.preventDefault();

        if (parseInt(editAward.awards_years) < 1950) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid year',
                text: 'Year must be greater than or equal to 1950',
            });
            return;
        }

        if (editAward.awards_name && editAward.country_name && editAward.awards_years) {
            const updatedAwardData = {
                awards_name: editAward.awards_name,
                country_name: editAward.country_name,
                awards_years: editAward.awards_years,
            };

            // Check if the edited country exists in the backend
            const countryExists = await checkCountryExists(editAward.country_name);
            if (!countryExists) {
                Swal.fire({
                    icon: 'error',
                    title: 'Country not found',
                    text: 'Country does not exist. Please add the country first.',
                });
                return;
            }

            try {
                const response = await fetch(`http://localhost:8001/awards/${editing}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedAwardData),
                    credentials: 'include',
                });

                const data = await response.json();
                setAwards((prevAwards) =>
                    prevAwards.map((award) => (award.id === editing ? data : award))
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Award updated successfully',
                    timer: 3000,
                });
                setIsEditing(false);
                setEditing(null);
                handleCloseModal();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while updating the award. Please try again later.',
                    timer: 3000,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'All fields must be filled',
                text: 'Please fill all fields before submitting',
                timer: 3000,
            });
        }
    };


    const handleDeleteAward = async () => {
        if (awardToDelete) {
            try {
                await fetch(`http://localhost:8001/awards/${awardToDelete.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                setAwards((prevAwards) => prevAwards.filter((award) => award.id !== awardToDelete.id));
                setShowDeleteModal(false);
                setAwardToDelete(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Award deleted successfully',
                    timer: 3000,
                });
            } catch (error) {
                Swal.fire({ 
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while deleting the award. Please try again later.',
                    timer: 3000,
                });
            }
        }
    };

    // Function untuk filter award berdasarkan search term (sebelum pagination)
    const filteredAwards = awards.filter((award) =>
        (award.awards_name && award.awards_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (award.country_name && award.country_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (award.awards_years && award.awards_years.toString().includes(searchTerm))
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
            <Container className="d-flex justify-content-end">
                <Row className="justify-content-end">
                    <Col xs="auto" className="d-flex mb-4">
                        <InputGroup className="mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <FormControl
                                type="text"
                                placeholder="Search Award, Country, or Year..."
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

                    {/* Button to Add New Genre */}
                    <Col xs="auto" className="d-flex mb-4">
                        <Button
                            variant="success"
                            className="d-flex align-items-center w-auto px-4 py-2 mb-4"
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={handleShowModal}>
                            <FaPlus className="me-2" />
                            Add New Award
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Award' : 'Add New Award'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Award</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="awards_name"
                                    value={isEditing ? editAward.awards_name : newAward.awards_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter award"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="country_name"
                                    value={isEditing ? editAward.country_name : newAward.country_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter country"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="awards_years"
                                    value={isEditing ? editAward.awards_years : newAward.awards_years}
                                    onChange={handleInputChange}
                                    placeholder="Enter year"
                                />
                            </Form.Group>
                        </Form>

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
                        style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
                        onClick={isEditing ? handleEditAward : handleAddAward}>
                        {isEditing ? 'Save Changes' : 'Submit'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the genre "{awardToDelete?.awards_name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteAward}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {loading ? (
                <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />

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
                                        <td>{award.awards_years}</td>
                                        <td>{award.awards_name}</td>
                                        <td>
                                            <Container className="action-button">
                                                <Button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => {
                                                        setIsEditing(true);
                                                        setShowModal(true);
                                                        setEditAward(award);
                                                        setEditing(award.id);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => {
                                                        setShowDeleteModal(true);
                                                        setAwardToDelete(award);
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

export default AwardsManager;
