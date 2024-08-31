import './movieReview.scss';
import React, { useState } from 'react';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import UserReview from '../userReview/userReview';
import ReviewInput from '../reviewInput/reviewInput';

const MovieReview = () => {
  const [showReviewInput, setShowReviewInput] = useState(false);

  const handleAddReviewClick = () => {
    setShowReviewInput(true);
  };

  const handleCloseReviewInput = () => {
    setShowReviewInput(false);
  };

  return (
    <Container>
      <Card className='movie-review'>
        <div className='titleSection'>
          Review
          <Button 
            variant="outline-light" 
            className='addReviewButton' 
            onClick={handleAddReviewClick}
          >
            Add Review
          </Button>
        </div>
        <Row>
          <Col xs={12} md={12}>
            <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
             <UserReview  
              userName="Louis Peitzman"
              userImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg"
              rating={4}
              reviewText="I'm starting to feel like the Weyland-Yutani Corporation does not have our best interests at heart."
            />
          </Col>
        </Row>
        {showReviewInput && (
          <ReviewInput 
            movieImage="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/qOKAI6aunD4J5MXiwwomAhI3jI2.jpg" 
            onClose={handleCloseReviewInput} 
          />
        )}
      </Card>
    </Container>
  );
}

export default MovieReview;
