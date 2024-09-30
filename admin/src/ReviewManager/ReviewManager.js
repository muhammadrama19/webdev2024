import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import "./ReviewManager.css";

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("None");
    const [showCount, setShowCount] = useState(10);

    useEffect(() => {
        const Reviews = async () => {
            try {
                const response = await fetch('http://localhost:8001/reviews');
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching actors:", error);
            }
        };
        Reviews();
    }, []);

    const handleApproveReview = (id) => {
        setReviews(reviews.map((review) =>
            review.id === id ? { ...review, status: "Approved" } : review
        ));
    };

    const handleDeleteReview = (id) => {
        setReviews(reviews.filter((review) => review.id !== id));
    };

    const handleFilterChange = (selectedFilter) => setFilter(selectedFilter);
    const handleShowCountChange = (count) => setShowCount(count);

    const filteredReviews = reviews.filter((review) => {
        if (filter === "None") return true;
        return filter === "Approved" ? review.status === 1 : review.status === 0;
    });    

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
                        {filteredReviews.slice(0, showCount).map((review) => (
                            <tr key={review.id}>
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
                                                onClick={() => handleApproveReview(review.id)}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteReview(review.id)}
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
        </Container>
    );
};

export default ReviewManager;
