// userReview.js
import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './userReview.scss';

const UserReview = ({ userName, userImage, rating, reviewText, createdAt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Truncate text if it's too long
  const truncatedText = reviewText.length > 150 ? reviewText.substring(0, 150) + '...' : reviewText;
  

  return (
    <Card className="user-review">
      <Card.Body>
        <Row>
          <Col xs={2} md={1} className="user-image">
            <img src={userImage} alt={userName} className="rounded-circle" />
          </Col>
          <Col xs={10} md={11} className="review-content">
            <Card.Title className="user-name">
              Review by {userName} 
              <span className="rating">
                {'⭐'.repeat(rating)} {/* Replace this with actual rating stars */}
              </span>
            </Card.Title>
            <Card.Subtitle className="review-date">
              {createdAt}
            </Card.Subtitle>
            <Card.Text className="review-text">
              {isExpanded ? reviewText : truncatedText}
              {reviewText.length > 150 && (
                <button onClick={toggleExpand} className="see-more btn btn-link p-0">
                  {isExpanded ? ' See less' : ' See more'}
                </button>
              )}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UserReview;
