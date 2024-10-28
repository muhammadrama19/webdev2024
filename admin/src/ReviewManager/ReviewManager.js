import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Dropdown, Pagination } from 'react-bootstrap';
import "./ReviewManager.css";

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("None");
    const [showCount, setShowCount] = useState(10);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [currentPage, setCurrentPage] = useState(1); // State for current page


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
            const response = await fetch(`http://localhost:8001/reviews/${id}`, {
                method: "PUT",
            });
            const data = await response.json();
            if (response.ok) {
                setReviews(reviews.map((review) =>
                    review.id === id ? { ...review, status: 1 } : review
                ));
                window.location.reload();
                console.log(data.message);
            } else {
                console.error("Error approving review:", data.error);
            }
        } catch (error) {
            console.error("Error approving review:", error);
        }
    };

    const deleteReview = async (id) => {
        try {
            const response = await fetch(`http://localhost:8001/reviews/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (response.ok) {
                setReviews(reviews.filter((review) => review.id !== id));
                window.location.reload();
                console.log(data.message);
            } else {
                console.error("Error deleting review:", data.error);
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleFilterChange = (selectedFilter) => setFilter(selectedFilter);
    const handleShowCountChange = (count) => setShowCount(count);

    const filteredReviews = reviews.filter((review) => {
        if (filter === "None") return true;
        return filter === "Approved" ? review.status === 1 : review.status === 0;
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

    return (
        <Container >
            <Container className="App">
                <h1 className="title">Reviews Manager</h1>
            </Container>
            {/* Filter Section */}
            <Row className="mb-3 justify-content-end">
                <Col xs="auto" className="d-flex">
                    <Dropdown onSelect={handleFilterChange}>
                        <Dropdown.Toggle variant="light" id="dropdown-filter">
                            Filtered by: {filter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="None">None</Dropdown.Item>
                            <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
                            <Dropdown.Item eventKey="Unapproved">Unapproved</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col xs="auto" className="d-flex">
                    <Dropdown onSelect={handleShowCountChange}>
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
            </Row>

            {loading ? (
                <p>Loading data...</p>
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
                                    <th>Comments</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.map((review) => (
                                    <tr key={review.review_id}>
                                        <td>{review.user_name}</td>
                                        <td>
                                            <Container className="rate-container">
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </Container>
                                        </td>
                                        <td>{review.movie_title}</td>
                                        <td>{review.content}</td>
                                        <td>{review.status === 1 ? "Approved" : "Unapproved"}</td>
                                        <td>
                                            <Container className="action-button">
                                                {review.status === 0 && (
                                                    <Button
                                                        variant="success"
                                                        className="me-2"
                                                        size="sm"
                                                        onClick={() => approveReview(review.review_id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => deleteReview(review.review_id)}
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
