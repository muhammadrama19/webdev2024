import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, Dropdown } from 'react-bootstrap';
import "./ReviewManager.css"; // Import custom styles

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
            comments: "Meh",
            status: "Approved",
            isChecked: false,
        },
    ]);

    const [filter, setFilter] = useState("None");
    const [showCount, setShowCount] = useState(10);

    const handleCheck = (id) => {
        setReviews(
            reviews.map((review) =>
                review.id === id ? { ...review, isChecked: !review.isChecked } : review
            )
        );
    };

    const handleSelectAll = () => {
        const allChecked = reviews.every((review) => review.isChecked);
        setReviews(
            reviews.map((review) => ({ ...review, isChecked: !allChecked }))
        );
    };

    const handleApproveSelected = () => {
        setReviews(
            reviews.map((review) =>
                review.isChecked ? { ...review, status: "Approved", isChecked: false } : review
            )
        );
    };

    const handleDeleteSelected = () => {
        setReviews(reviews.filter((review) => !review.isChecked));
    };

    const handleFilterChange = (selectedFilter) => setFilter(selectedFilter);
    const handleShowCountChange = (count) => setShowCount(count);

    return (
        <Container className="mt-5 custom-container">
            {/* Filter Section */}
            <Row className="mb-3">
                <Col md={3}>
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
                <Col md={2}>
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
                    {reviews.map((review) => (
                        <tr key={review.id} className={review.status === "Unapproved" ? "table-danger" : ""}>
                            <td>{review.username}</td>
                            <td>
                            <div className="star-container">
                                {"★".repeat(review.rate)}{"☆".repeat(5 - review.rate)}
                            </div>
                            </td>
                            <td>{review.drama}</td>
                            <td>{review.comments}</td>
                            <td>{review.status}</td>
                            <td>
                            <Button variant="success" onClick={handleApproveSelected} className="me-2" size="sm">
                                Approve
                            </Button>
                            <Button variant="danger" onClick={handleDeleteSelected} size="sm">
                                Delete
                            </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ReviewManager;
