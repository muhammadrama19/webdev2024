import './movieReview.scss';
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import UserReview from '../userReview/userReview';
import imageIcon from '../../assets/Oval.svg'; // Correct path to the placeholder image

const  apiUrl = process.env.REACT_APP_API_URL;

const MovieReview = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fallback = imageIcon;


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiUrl}/movies/detail/review/${id}`); 
        const data = await response.json();
        console.log(data); // Inspect the API response
        setReviews(data || []); // Ensure `data` is an array
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id]); // Add `id` as a dependency to refetch reviews when `id` changes

  const handleAddReviewClick = () => {
    setShowReviewInput(true);
  };

  const handleCloseReviewInput = () => {
    setShowReviewInput(false);
  };

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <Container>
      <Card className='movie-review'>
        <div className='titleSection'>Reviews</div>
        <Row>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <Col xs={12} md={12} key={review.review_id}>
                <UserReview
                  userName={review.user_name} 
                  userImage={review.user_picture || fallback } // Correct path to the placeholder image
                  rating={review.rating || 'No rating provided'} // Handle null rating
                  reviewText={review.content}
                  createdAt={new Date(review.created_at).toLocaleDateString()} // Format the date
                />
              </Col>
            ))
          ) : (
            <Col>
              <p>No reviews available.</p>
            </Col>
          )}
        </Row>
      </Card>
    </Container>
  );
};

export default MovieReview;
