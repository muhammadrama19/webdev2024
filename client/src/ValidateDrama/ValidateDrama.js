import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import PaginationCustom from "../components/pagination/pagination"; // Import your custom pagination component
import './ValidateDrama.scss';

const ValidateDrama = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDrama, setSelectedDrama] = useState(null);
  const [showCount] = useState(10); // Change this to set the number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/movie-list?status=3"); // Fetch movies with status 3
        const data = await response.json();
        setDramas(data);
        setLoading(false); // Stop loading once data is fetched
        setTotalPages(Math.ceil(data.length / showCount)); // Set total pages based on fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies(); // Call the function to fetch data
  }, [showCount]);

  const handleShowDetail = (drama) => {
    setSelectedDrama(drama);
    setShowDetailModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate which dramas to display based on the current page
  const indexOfLastDrama = currentPage * showCount;
  const indexOfFirstDrama = indexOfLastDrama - showCount;

  // Filter dramas based on search term
  const filteredDramas = dramas.filter((drama) => {
    const username = drama.username || ""; // Fallback to an empty string if username is undefined
    const movie = drama.movie || ""; // Fallback to an empty string if movie is undefined
  
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  // Update total pages based on filtered data
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDramas.length / showCount));
  }, [filteredDramas, showCount]);

  const currentDramas = filteredDramas.slice(indexOfFirstDrama, indexOfLastDrama);

  return (
    <Container className="drama-list" style={{ padding: '20px' }}>
      <h2 className="my-4" style={{ textAlign: 'center' }}>Drama List</h2>

      <Form.Control
        type="text"
        placeholder="Search dramas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Table striped bordered hover responsive className="text-center" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Movie</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDramas.map((drama) => (
              <tr key={drama.id}>
                <td>{drama.username}</td>
                <td>{drama.title}</td>
                <td>{drama.status}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetail(drama)} style={{ marginRight: '10px' }}>
                    Details
                  </Button>
                  {/* Additional actions can be added here */}
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
          <Modal.Title>{selectedDrama?.movie}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Username:</strong> {selectedDrama?.username}</p>
          <p><strong>Status:</strong> {selectedDrama?.status}</p>
          {/* Add more details as needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ValidateDrama;
