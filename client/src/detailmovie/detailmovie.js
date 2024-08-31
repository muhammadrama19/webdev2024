import React from "react";
import "./detailmovie.scss";
import MovieDetail from "../components/moviecarddetail/movieCardDetail";
import ActorSlider from "../components/actorSlider/actorSlider";
import MovieReview from "../components/movieReview/movieReview";
import MediaTrailer from "../components/media/media";
import { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';

import ReviewBar from '../components/reviewBar/reviewBar';

const Detailmovie = () => {
  const [showReviewInput, setShowReviewInput] = useState(true);

  const handleClose = () => {
    setShowReviewInput(false);
  };

  return (
    <div className="movieDetail">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            <MovieDetail
              title="Another Title"
              rating="6.9"
              metaScore="N/A"
              description="Epic drama set thousands of years before the events of J.R.R. Tolkien's 'The Hobbit' and 'The Lord of the Rings'..."
              creators={["Patrick McKay", "John D. Payne"]}
              genres={["Action", "Adventure", "Drama"]}
              imageSrc="https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"
            />
          </Col>
          <Col md={4}>
            <ReviewBar/>
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <ActorSlider />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <MediaTrailer />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <MovieReview />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Detailmovie;
