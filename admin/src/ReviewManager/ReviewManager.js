import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Dropdown } from 'react-bootstrap';
import "./ReviewManager.css";

const ReviewManager = () => {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            username: "Nara",
            rate: 5,
            drama: "[2024] Japan - Eye Love You",
            comments: `I love this drama. It taught me a lot about money and finance. Love is not everything. 
            We need to face the reality too. Being stoic is the best.\n\nWhat the most thing that I love is about the kindness. Having money is perfect.`,
            status: "Unapproved",
            isChecked: false,
        },
        {
            id: 3,
            username: "Nara",
            rate: 5,
            drama: "[2024] Japan - Eye Love You",
            comments: `I love this drama. It taught me a lot about money and finance. Love is not everything. 
            We need to face the reality too. Being stoic is the best.\n\nWhat the most thing that I love is about the kindness. Having money is perfect.`,
            status: "Unapproved",
            isChecked: false,
        },
        {
            id: 2,
            username: "Luffy",
            rate: 2,
            drama: "[2024] Japan - Eye Love You",
            comments: "This drama is so boring. I don't like it.",
            status: "Approved",
            isChecked: false,
        },
    ]);

    const [filter, setFilter] = useState("None");
    const [showCount, setShowCount] = useState(10);

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
        return review.status === filter;
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
                                <td>{review.username}</td>
                                <td>
                                    <Container className="rate-container">
                                        {"★".repeat(review.rate)}{"☆".repeat(5 - review.rate)}
                                    </Container>
                                </td>
                                <td>{review.drama}</td>
                                <td>{review.comments}</td>
                                <td>{review.status}</td>
                                <td>
                                    <Container className="action-button">
                                        {review.status === "Unapproved" && (
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
