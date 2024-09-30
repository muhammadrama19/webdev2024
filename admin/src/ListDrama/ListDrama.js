import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Form, Container, Modal, Button, Col, Dropdown, Pagination } from "react-bootstrap";
import "../ListDrama/ListDrama.css";

const ListDrama = ({ trashDramas, setTrashDramas, viewTrash = false }) => {
  const [showCount, setShowCount] = useState(10); // Items per page
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [editingDrama, setEditingDrama] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian

  // useEffect to fetch data from backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Jika di halaman trash, ambil movie dengan status 0
        const response = await fetch(`http://localhost:8001/movie-list?status=${viewTrash ? 0 : 1}`);
        const data = await response.json();
        setDramas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [viewTrash]); // Menjalankan ulang useEffect jika viewTrash berubah

  const handleEdit = (drama) => {
    setEditingDrama(drama);
    setShowModal(true);
  };

  // Mengubah status movie menjadi 0 (delete soft)
  const handleDelete = async (id) => {
    try {
      // Lakukan request PUT ke backend untuk mengubah status menjadi 0
      await fetch(`http://localhost:8001/movie-delete/${id}`, {
        method: 'PUT', // Mengubah status menggunakan metode PUT
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 0 }) // Mengirimkan status 0 untuk soft delete
      });
      
      // Hapus movie dari state setelah soft delete berhasil
      setDramas(dramas.filter((drama) => drama.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };
  

  const handleSave = () => {
    setDramas(
      dramas.map((drama) =>
        drama.id === editingDrama.id ? editingDrama : drama
      )
    );
    setEditingDrama(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setEditingDrama({
      ...editingDrama,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleAddMovies = () => {
    navigate("/movie-input");
  };

  const handleViewTrash = () => {
    navigate("/movie-trash");
  };

  // Function untuk filter drama berdasarkan search term (sebelum pagination)
  const filteredDramas = dramas.filter((drama) => 
    drama.title && drama.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (drama.Actors && drama.Actors.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (drama.Genres && drama.Genres.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic (setelah pencarian)
  const indexOfLastDrama = currentPage * showCount;
  const indexOfFirstDrama = indexOfLastDrama - showCount;
  const currentDramas = filteredDramas.slice(indexOfFirstDrama, indexOfLastDrama); // Paginate hasil pencarian
  const totalPages = Math.ceil(filteredDramas.length / showCount);

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
            value={searchTerm} // Menghubungkan input pencarian dengan state searchTerm
            onChange={(e) => setSearchTerm(e.target.value)} // Update state saat pengguna mengetik
          />
        </div>

        <div>
          {!viewTrash && (
            <Button className="btn btn-danger me-2" onClick={handleViewTrash}>
              Trash
            </Button>
          )}

          <Button className="btn btn-success" onClick={handleAddMovies}>
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
                  <th>Drama</th>
                  <th>Actors</th>
                  <th>Genres</th>
                  <th>Synopsis</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentDramas.map((drama, index) => (
                  <tr key={drama.id}>
                    <td>{indexOfFirstDrama + index + 1}</td> {/* Adjusting index to show proper numbering */}
                    <td>{drama.title}</td>
                    <td>{drama.Actors}</td>
                    <td>{drama.Genres}</td>
                    <td>{drama.synopsis}</td>
                    <td>
                      <Container className="action-button">
                        <Button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(drama)}
                        >
                          Edit
                        </Button>
                        {!viewTrash && (
                          <Button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(drama.id)}
                          >
                            Delete
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
            <Modal.Title>Edit Drama</Modal.Title>
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
              <Form.Group controlId="formDramaActors">
                <Form.Label>Actors</Form.Label>
                <Form.Control
                  type="text"
                  name="actors"
                  value={editingDrama.Actors}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDramaGenres">
                <Form.Label>Genres</Form.Label>
                <Form.Control
                  type="text"
                  name="genres"
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
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ListDrama;
