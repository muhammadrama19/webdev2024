import React, { useState } from "react";
import "./reviewInput.scss";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";

const ReviewInput = ({ movieImage, title, movieId, userId, onClose }) => {  // Tambahkan movieId dan userId sebagai props
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [review, setReview] = useState("");

  const handleRating = (index) => {
    setRating(index);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const handleSave = async () => {
    // Buat request POST ke server untuk menyimpan review
    const reviewData = {
      movie_id: movieId,   // Menggunakan movieId dari props
      user_id: userId,     // Menggunakan userId dari props
      content: review,     // Isi review dari state
      rating: rating,      // Rating dari state
      status: 0            // Set status review ke 0 (menunggu persetujuan)
    };

    try {
      const response = await fetch("http://localhost:8001/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert("Review saved successfully!");
        onClose(); // Tutup modal setelah review disimpan
      } else {
        console.error("Error saving review:", response);
        alert("Failed to save review. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save review due to a network error.");
    }
  };

  return (
    <Modal show onHide={onClose} centered dialogClassName="review-input-modal">
      <Modal.Body className="review-input-container">
        <Row>
          <Col xs={12} md={3} className="text-center">
            <img src={movieImage} alt="Movie Poster" className="movie-image" />
          </Col>
          <Col xs={12} md={9} className="review-content">
            <button className="close-button" onClick={onClose}>
              <CloseIcon />
            </button>
            <h2>{title}</h2>
            <Form.Group controlId="reviewTextarea">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </Form.Group>
            <div className="rating-section">
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={index < rating ? "filled" : "unfilled"}
                    onClick={() => handleRating(index + 1)}
                  />
                ))}
              </div>
              <div className="like" onClick={toggleLike}>
                {liked ? <FavoriteIcon className="liked" /> : <FavoriteBorderIcon />}
              </div>
            </div>
            <Button variant="success" className="save-button" onClick={handleSave}>
              Save
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewInput;
