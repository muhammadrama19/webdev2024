import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Form, Container, Modal, Button, Col, Dropdown, Pagination } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../ListDrama/ListDrama.scss";

const ListDrama = ({ trashDramas, setTrashDramas, viewTrash = false }) => {
  const [showCount, setShowCount] = useState(10); // Items per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [editingDrama, setEditingDrama] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian

  // State untuk menampilkan modal detail film
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Menyimpan data film yang dipilih

  // useEffect to fetch data from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Jika di halaman trash, ambil movie dengan status 0
        const response = await fetch(`http://localhost:8001/movie-list?status=${viewTrash ? 0 : 1}`);
        const data = await response.json();
        setDramas(data);
        console.log("Data fetched:", data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [viewTrash]); // Menjalankan ulang useEffect jika viewTrash berubah

  const handleEdit = (drama) => {
    console.info("Editing movie:", drama);
    navigate("/movie-input", { state: { movieData: drama } }); // Redirect with existing movie data
  };

  const handleShowDetail = (movie) => {
    setSelectedMovie(movie);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8001/movie-delete/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: 0 }),
      });
      setDramas(dramas.filter((drama) => drama.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleSave = () => {
    setDramas(dramas.map((drama) => (drama.id === editingDrama.id ? editingDrama : drama)));
    setEditingDrama(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setEditingDrama({ ...editingDrama, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleAddMovies = () => {
    navigate("/movie-input");
  };

  const handleViewTrash = () => {
    navigate("/movie-trash");
  };

  const filteredDramas = dramas.filter(
    (drama) =>
      (drama.title && drama.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (drama.Actors && drama.Actors.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (drama.Genres && drama.Genres.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastDrama = currentPage * showCount;
  const indexOfFirstDrama = indexOfLastDrama - showCount;
  const currentDramas = filteredDramas.slice(indexOfFirstDrama, indexOfLastDrama);
  console.log("currentDramas", currentDramas);
  const totalPages = Math.ceil(filteredDramas.length / showCount);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <h1 className="title">{viewTrash ? "Movies Trash" : "Movies List"}</h1>
      </Container>

      <div className="list-drama-header d-flex justify-content-between mb-3">
        <div className="d-flex">
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
        </div>

        <div>
          {!viewTrash && (
            <Button className="btn btn-danger me-2" onClick={handleViewTrash}>
              <FaTrash className="me-2" />
              Trash
            </Button>
          )}

          <Button className="btn btn-success" onClick={handleAddMovies}>
            <FaPlus className="me-2" />
            Add Movies
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="drama-table-wrapper">
            <Table striped bordered hover className="drama-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Poster</th>
                  <th>Title</th>
                  <th className="genres-column">Genres</th>
                  <th>Actor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDramas.map((drama, index) => (
                  <tr key={drama.id}>
                    <td>{indexOfFirstDrama + index + 1}</td>
                    <td>
                      {drama.poster ? (
                        <img
                          src={drama.poster}
                          alt={drama.title}
                          className="poster-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x150?text=No+Image";
                          }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="title-column" onClick={() => handleShowDetail(drama)}>
                      {drama.title}
                    </td>
                    <td className="genres-column">{drama.Genres}</td>
                    <td>{drama.Actors}</td>
                    <td className="action-column">
                      <Container className="action-button">
                      <Button
                        className="btn btn-sm btn-primary me-3"
                        onClick={() => handleEdit({...drama})}
                      >
                          Edit
                        </Button>
                        {!viewTrash && (
                          <Button className="btn btn-sm btn-danger" onClick={() => handleDelete(drama.id)}>
                            Trash
                          </Button>
                        )}
                      </Container>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {renderPagination()}
        </>
      )}

      {editingDrama && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Movie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDramaTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editingDrama.title}
                  onChange={handleChange}
                />
              </Form.Group>
              {/* <Form.Group controlId="formDramaAlt_Title">
                <Form.Label>Alternative Title</Form.Label>
                <Form.Control
                  type="text"
                  name="alt_title"
                  value={editingDrama.alt_title}
                  onChange={handleChange}
                />
              </Form.Group> */}
              <Form.Group controlId="formDramaActors">
                <Form.Label>Actors</Form.Label>
                <Form.Control
                  type="text"
                  name="Actors"
                  value={editingDrama.Actors}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaGenres">
                <Form.Label>Genres</Form.Label>
                <Form.Control
                  type="text"
                  name="Genres"
                  value={editingDrama.Genres}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaSynopsis">
                <Form.Label>Synopsis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="synopsis"
                  value={editingDrama.synopsis}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="mt-2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="mt-2" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

{selectedMovie && (
  <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>{selectedMovie.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="detail-modal">
        <div className="poster-detail-container">
          <img
            src={selectedMovie.poster || "https://via.placeholder.com/100x150?text=No+Image"}
            alt={selectedMovie.title}
            className="poster-detail"
          />
          <Button
            variant="primary"
            className="edit-button"
            onClick={() => {
              setShowDetailModal(false);
              handleEdit(selectedMovie);
            }}
          >
            Edit
          </Button>
        </div>
        <div className="detail-content">
          <p><strong>Year:</strong> {selectedMovie.release_year || "Unknown"}</p>
          <p><strong>Genres:</strong> {selectedMovie.Genres}</p>
          <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
          <p><strong>Synopsis:</strong></p>
          <p>{selectedMovie.synopsis}</p>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
)}

    </Container>
  );
};

export default ListDrama;
