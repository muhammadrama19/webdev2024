import React, { useEffect, useState } from "react";
import "./detailmovie.scss";
import MovieDetailCard from "../../../components/moviecarddetail/movieCardDetail";
import MovieReview from "../../../components/movieReview/movieReview";
import { Container, Row, Col } from 'react-bootstrap';
import ReviewBar from "../../../components/reviewBar/reviewBar"
import CoverDetail from "../../../components/coverdetail/coverDetail";
import ActorSlider from "../../../components/actorSlider/actorSlider";
import MediaPlayer from "../../../components/media/media";
import { useParams } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import ErrorPage from  '../error/errorPage'; 
import useMediaQuery from "../../../hooks/useMediaQuery";

const apiUrl = process.env.REACT_APP_API_URL;

const Detailmovie = () => {
  const [movieData, setMovieData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${apiUrl}/movies/detail/${id}`);
        if (!response.ok) {
          if (response.status === 404) setError(true);
          return;
        }
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        setError(true);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");
    if (token && user_id) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsLoggedIn(true);
        setUserId(user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  if (error) return <ErrorPage />;
  if (!movieData) return <div>Loading...</div>;

  return (
    <>
      {isDesktop && <CoverDetail srcBackground={movieData.background} />}
      <Container fluid className="detail-movie-container">
        <Row className="justify-content-center align-items-start">
          <Col xs={12} md={8}>
            <MovieDetailCard
              title={movieData.title}
              rating={movieData.imdb_score}
              country={movieData.countries.map((c) => c.name).join(", ")}
              description={movieData.synopsis}
              creators={[movieData.director]}
              genres={movieData.genre.map((g) => g.name)}
              imageSrc={movieData.poster}
              availability={movieData.availability}
              status={movieData.status}
            />
          </Col>
          <Col xs={12} md={4} className="mt-4 mt-md-0">
            <ReviewBar
              srcImg={movieData.poster}
              title={movieData.title}
              isLoggedIn={isLoggedIn}
              movieId={id}
              userId={userId}
            />
          </Col>
        </Row>
        {/* Actor Slider */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            <ActorSlider actors={movieData.actors} />
          </Col>
        </Row>
        {/* Media Trailer */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            <MediaPlayer link={movieData.trailer || ""} />
          </Col>
        </Row>
        {/* Movie Review */}
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            <MovieReview id={movieData.id} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Detailmovie;
