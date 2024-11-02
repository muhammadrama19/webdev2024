import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import PaginationCustom from "../components/pagination/pagination"; // Import your custom pagination component
import './InputGenres.css'; // Create a new SCSS file for styles if needed

const Genres = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [newGenreName, setNewGenreName] = useState("");
  const [showCount] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    fetchGenres();
  }, [showCount]);

  const fetchGenres = async () => {
    try {
      const response = await fetch("http://localhost:8001/genres"); // Fetch genres
      const data = await response.json();
      setGenres(data);
      setLoading(false); // Stop loading once data is fetched
      setTotalPages(Math.ceil(data.length / showCount)); // Set total pages based on fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleShowDetail = (genre) => {
    setSelectedGenre(genre);
    setShowDetailModal(true);
  };

  const handleShowAddEditModal = (genre = null) => {
    setSelectedGenre(genre);
    setNewGenreName(genre ? genre.name : "");
    setShowAddEditModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastGenre = currentPage * showCount;
  const indexOfFirstGenre = indexOfLastGenre - showCount;

  const filteredGenres = genres.filter((genre) => {
    const name = genre.name || ""; // Fallback to an empty string if name is undefined
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredGenres.length / showCount));
  }, [filteredGenres, showCount]);

  const currentGenres = filteredGenres.slice(indexOfFirstGenre, indexOfLastGenre);

  const handleAddEditGenre = async (e) => {
    e.preventDefault();
    const method = selectedGenre ? 'PUT' : 'POST';
    const url = selectedGenre 
      ? `http://localhost:8001/genres/${selectedGenre.id}` 
      : 'http://localhost:8001/genres';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGenreName }),
      });
      
      if (!response.ok) throw new Error('Failed to add/update genre');

      fetchGenres(); // Refresh genres list after adding/updating
      setShowAddEditModal(false);
      setNewGenreName(""); // Reset input
    } catch (error) {
      console.error("Error adding/updating genre:", error);
    }
  };

  const handleDeleteGenre = async (id) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        const response = await fetch(`http://localhost:8001/genres/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete genre');

        fetchGenres(); // Refresh genres list after deletion
      } catch (error) {
        console.error("Error deleting genre:", error);
      }
    }
  };

return (
    <Container className="genre-list pt-3" style={{ padding: '20px' }}>
        <h2 className="my-4" style={{ textAlign: 'center' }}>Genre List</h2>

        <Form.Control
            type="text"
            placeholder="Search genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            style={{ marginBottom: '20px' }}
        />

        <Button variant="primary" onClick={() => handleShowAddEditModal()} className="mb-4">
            Add Genre
        </Button>

        {loading ? (
            <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
        ) : (
            <Table striped bordered hover responsive className="text-center" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Genre Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentGenres.map((genre) => (
                        <tr key={genre.id}>
                            <td>{genre.id}</td>
                            <td>{genre.name}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowDetail(genre)} style={{ marginRight: '10px' }}>
                                    Details
                                </Button>
                                <Button variant="warning" onClick={() => handleShowAddEditModal(genre)} style={{ marginRight: '10px' }}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteGenre(genre.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}

        <PaginationCustom
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />

        {/* Detail Modal */}
        <Modal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{selectedGenre?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Genre ID:</strong> {selectedGenre?.id}</p>
                <p><strong>Name:</strong> {selectedGenre?.name}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>

        {/* Add/Edit Modal */}
        <Modal
            show={showAddEditModal}
            onHide={() => setShowAddEditModal(false)}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{selectedGenre ? "Edit Genre" : "Add Genre"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleAddEditGenre}>
                    <Form.Group controlId="formGenreName">
                        <Form.Label>Genre Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter genre name"
                            value={newGenreName}
                            onChange={(e) => setNewGenreName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit"> 
                        {selectedGenre ? "Update Genre" : "Add Genre"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </Container>
);
};

export default Genres;
