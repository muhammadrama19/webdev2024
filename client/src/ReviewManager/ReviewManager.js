import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import PaginationCustom from "../components/pagination/pagination";
import './ReviewManager.css';

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showCount] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8001/reviews");
        const data = await response.json();
        setReviews(data);
        setLoading(false);
        setTotalPages(Math.ceil(data.length / showCount));
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [showCount]);

  const handleShowDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Delete review function
  const handleDeleteReview = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8001/reviews/${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();

        if (response.ok) {
          setReviews(reviews.filter(review => review.review_id !== id)); // Update the state to remove the deleted review
          alert(result.message);
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const indexOfLastReview = currentPage * showCount;
  const indexOfFirstReview = indexOfLastReview - showCount;

  const filteredReviews = reviews.filter((review) => {
    const content = review.content || "";
    const movieTitle = review.movie_title || "";
    const userName = review.user_name || "";

    const matchesSearchTerm =
      content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || (statusFilter === "approved" && review.status === 1) || (statusFilter === "not-approved" && review.status === 0);

    return matchesSearchTerm && matchesStatus;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredReviews.length / showCount));
  }, [filteredReviews, showCount]);

  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <Container className="review-list" style={{ padding: '20px' }}>
      <h2 className="my-4" style={{ textAlign: 'center' }}>Review List</h2>

      <Form.Control
        type="text"
        placeholder="Search reviews, movie titles, or usernames..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        style={{ marginBottom: '20px' }}
      />

      <div className="mb-4">
        <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '200px', display: 'inline-block' }}>
          <option value="all">All Reviews</option>
          <option value="approved">Approved</option>
          <option value="not-approved">Not Approved</option>
        </Form.Select>
      </div>

      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Table striped bordered hover responsive className="text-center" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Review ID</th>
              <th>User Name</th>
              <th>Movie Title</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review.review_id}>
                <td>{review.review_id}</td>
                <td>{review.user_name}</td>
                <td>{review.movie_title}</td>
                <td>{review.rating}</td>
                <td>{review.content}</td>
                <td>{review.status === 1 ? "Approved" : "Not Approved"}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowDetail(review)} style={{ marginRight: '10px' }}>
                    Details
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteReview(review.review_id)}>
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
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Review ID:</strong> {selectedReview?.review_id}</p>
          <p><strong>User Name:</strong> {selectedReview?.user_name}</p>
          <p><strong>Movie Title:</strong> {selectedReview?.movie_title}</p>
          <p><strong>Rating:</strong> {selectedReview?.rating}</p>
          <p><strong>Content:</strong> {selectedReview?.content}</p>
          <p><strong>Status:</strong> {selectedReview?.status === 1 ? "Approved" : "Not Approved"}</p>
          <p><strong>Created At:</strong> {new Date(selectedReview?.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(selectedReview?.updated_at).toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Reviews;
