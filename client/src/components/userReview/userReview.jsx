import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './userReview.scss';

const UserReview = ({ userName, userImage, rating, reviewText }) => {
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
            <Card.Text className="review-text">
              {reviewText}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UserReview;