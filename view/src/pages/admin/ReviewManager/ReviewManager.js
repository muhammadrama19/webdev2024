import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal, Spinner, Pagination, InputGroup, FormControl, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import "./ReviewManager.css";
import Swal from "sweetalert2";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [showCount, setShowCount] = useState(10);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [currentPage, setCurrentPage] = useState(1); // State for current page  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const Reviews = async () => {
      try {
        const response = await fetch('http://localhost:8001/reviews');
        const data = await response.json();
        setReviews(data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching actors:", error);
        setLoading(false);
      }
    };
    Reviews();
  }, []);

  const approveReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/reviews/${id}/approve`, {
        method: "PUT", // or you could change it to PATCH if preferred
        credentials: "include",
      });
      if (response.ok) {
        setReviews(reviews.map((review) =>
          review.id === id ? { ...review, status: 1 } : review
        ));
        setSelectedReview(null);
        setShowActionModal(false);
        Swal.fire({
          icon: "success",
          title: "Review approved",
          text: "The review has been approved successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to approve review",
          text: "An error occurred while approving the review. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error approving review:", error);
      Swal.fire({ 
        icon: "error",
        title: "Failed to approve review",
        text: "An error occurred while approving the review. Please try again later.",
      });
    }
  };

  const softDeleteReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/reviews/${id}/soft-delete`, {
        method: 'PUT', // or change to PATCH
        credentials: "include",
      });

      if (response.ok) {
        // Update reviews list by removing the soft-deleted review
        setReviews(reviews.filter(review => review.id !== id)); // Adjust to match your data structure
        setSelectedReview(null);
        setShowActionModal(false);
        Swal.fire({
          icon: "success",
          title: "Review deleted!",
          text: "Review has been succesfully deleted!",
          timer: 2000

        })
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to delete review",
          text: "An error occurred while deleting the review. Please try again later.",
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Error soft-deleting review:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete review",
        text: "An error occurred while deleting the review. Please try again later.",
        timer: 2000
      })
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const content = review.content || "";
    const movieTitle = review.movie_title || "";
    const userName = review.user_name || "";

    const matchesSearchTerm =
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || (statusFilter === "approved" && review.status === 1) || (statusFilter === "unapproved" && review.status === 0);

    return matchesSearchTerm && matchesStatus;
  });


  // Pagination logic (setelah pencarian)
  const indexOfLastReview = currentPage * showCount;
  const indexOfFirstReview = indexOfLastReview - showCount;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview); // Paginate hasil pencarian
  const totalPages = Math.ceil(filteredReviews.length / showCount);

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

  const truncateContent = (text, length = 50) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const handleShowModal = (review, type) => {
    setSelectedReview(review);
    if (type === "detail") {
      setShowDetailModal(true);
    } else {
      setModalType(type);
      setShowActionModal(true);
    }
  };

  return (
    <Container >
      <Container className="App">
        <h1 className="title">Reviews Manager</h1>
      </Container>
      {/* Filter Section */}
      <Container className="d-flex justify-content-end">
        <Row className="mb-3 justify-content-end">
          <Col xs="auto" className="d-flex">
            <InputGroup className="mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Search reviews, movie titles, or usernames..."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs="auto" className="d-flex mb-4">
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '150px', display: 'inline-block' }}>
              <option value="all">All Reviews</option>
              <option value="approved">Approved</option>
              <option value="unapproved">Unapproved</option>
            </Form.Select>
          </Col>
          <Col xs="auto" className="d-flex mb-4">
            <Form.Select value={showCount} onChange={(e) => setShowCount(e.target.value)} style={{ width: '80px', display: 'inline-block' }}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Form.Select>
          </Col>
        </Row>
      </Container>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "approve" ? "Approve Review" : "Delete Review"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "approve" ? (
            <p>Are you sure you want to approve this review?</p>
          ) : (
            <p>Are you sure you want to delete this review?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>Cancel</Button>
          <Button
            variant={modalType === "approve" ? "success" : "danger"}
            onClick={() => {
              modalType === "approve" ? approveReview(selectedReview.review_id) : softDeleteReview(selectedReview.review_id);
            }}
          >
            {modalType === "approve" ? "Approve" : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Review ID:</strong> {selectedReview?.review_id}</p>
          <p><strong>User Name:</strong> {selectedReview?.user_name}</p>
          <p><strong>Movie Title:</strong> {selectedReview?.movie_title}</p>
          <p><strong>Rating:</strong> {selectedReview?.rating}</p>
          <p><strong>Content:</strong> {selectedReview?.content}</p>
          <p><strong>Status:</strong> {selectedReview?.status === 1 ? "Approved" : "Unapproved"}</p>
          <p><strong>Created At:</strong> {new Date(selectedReview?.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(selectedReview?.updated_at).toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <>

          {/* Table Section */}
          <Container className="review-table-wrapper">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Rate</th>
                  <th>Drama</th>
                  <th>Content</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <tr key={review.review_id}>
                    <td>{review.user_name}</td>
                    <td>{review.rating}</td>
                    <td>{review.movie_title}</td>
                    <td>{truncateContent(review.content, 100)}</td>
                    <td>{review.status === 1 ? "Approved" : "Unapproved"}</td>
                    <td>
                      <Container className="action-button">
                        <Button
                          variant="info"
                          className="me-2"
                          size="sm"
                          onClick={() => handleShowModal(review, "detail")}
                          style={{ marginRight: '10px' }}
                        >
                          Details
                        </Button>
                        {review.status === 0 && (
                          <Button
                            variant="success"
                            className="me-2"
                            size="sm"
                            onClick={() => handleShowModal(review, "approve")}
                          >
                            Approve
                          </Button>
                        )}

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleShowModal(review, "delete")}
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

export default ReviewManager;
