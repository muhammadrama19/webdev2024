import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import PaginationCustom from "../components/pagination/pagination"; // Import the custom pagination component
import './ListDrama.scss';

const MovieList = () => {
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewTrash, setViewTrash] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/movie-list?status=${viewTrash ? 0 : 1}`);
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, [viewTrash]);

  const handleShowDetail = (movie) => {
    setSelectedMovie(movie);
    setShowDetailModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSaveChanges = () => {
    // Add save functionality here
    setIsEditing(false);
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.Actors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.Genres.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMovie = currentPage * showCount;
  const indexOfFirstMovie = indexOfLastMovie - showCount;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / showCount);

  return (
    <Container className="movie-list" style={{ padding: '20px' }}>
      <h2 className="my-4" style={{ textAlign: 'center' }}>Movie List</h2>
      <Form.Control
        type="text"
        placeholder="Search movies..."
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
              <th>Poster</th>
              <th>Title</th>
              <th>Release Year</th>
              <th>Actors</th>
              <th>Genres</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovies.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <img src={movie.poster} alt={movie.title} className="poster-img" style={{ width: '50px', height: '75px' }} />
                </td>
                <td>{movie.title}</td>
                <td>{movie.release_year}</td>
                <td>{movie.Actors}</td>
                <td>{movie.Genres}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetail(movie)} style={{ marginRight: '10px' }}>
                    Details
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
  className="movie-detail-modal"
>
  <Modal.Header closeButton>
    <Modal.Title>{isEditing ? "Edit Movie" : selectedMovie?.title}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {isEditing ? (
      <>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" defaultValue={selectedMovie?.title} />
        </Form.Group>
        <Form.Group controlId="formActors" className="mt-3">
          <Form.Label>Actors</Form.Label>
          <Form.Control type="text" defaultValue={selectedMovie?.Actors} />
        </Form.Group>
        <Form.Group controlId="formGenres" className="mt-3">
          <Form.Label>Genres</Form.Label>
          <Form.Control type="text" defaultValue={selectedMovie?.Genres} />
        </Form.Group>
        <Form.Group controlId="formSynopsis" className="mt-3">
          <Form.Label>Synopsis</Form.Label>
          <Form.Control as="textarea" rows={3} defaultValue={selectedMovie?.synopsis} />
        </Form.Group>
      </>
    ) : (
      <>
        <img src={selectedMovie?.poster} alt={selectedMovie?.title} className="detail-poster mb-3 justify-content-center align-item-center " style={{ width: 'auto', height: '50vh' }} />
        <p><strong>Actors:</strong> {selectedMovie?.Actors}</p>
        <p><strong>Genres:</strong> {selectedMovie?.Genres}</p>
        <p><strong>Synopsis:</strong> {selectedMovie?.synopsis}</p>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    {isEditing ? (
      <>
        <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
      </>
    ) : (
      <>
        <Button variant="primary" onClick={handleEditToggle}>Edit</Button>
        <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
      </>
    )}
  </Modal.Footer>
</Modal>

    </Container>
  );
};

export default MovieList;
