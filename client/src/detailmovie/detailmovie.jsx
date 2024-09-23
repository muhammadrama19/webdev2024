import React, { useEffect, useState } from "react";
import "./detailmovie.scss";
import MovieDetailCard from "../components/moviecarddetail/movieCardDetail";
import MovieReview from "../components/movieReview/movieReview";
import { Container, Row, Col } from 'react-bootstrap';
import ReviewBar from '../components/reviewBar/reviewBar';
import CoverDetail from "../components/coverdetail/coverDetail";
import ActorSlider from "../components/actorSlider/actorSlider";
import MediaPlayer from "../components/media/media";
import { useParams } from 'react-router-dom'; 

const Detailmovie = () => {
  const [movieData, setMovieData] = useState(null);
  const { id } = useParams(); 

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8001/movies/detail/${id}`); // Use ID from URL params
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]); 

  if (!movieData) {
    return <div>Loading...</div>; // Show loading while data is fetched
  }

  return (
    <div className="movieDetail">
      <CoverDetail srcBackground={movieData.background}/>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
            {/* Populate MovieDetailCard with fetched data */}
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
          <Col md={4}>
            <ReviewBar srcImg={movieData.poster} title={movieData.title}/>
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
          <ActorSlider actors={movieData.actors} />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
           <MediaPlayer link={movieData.trailer || ""}/>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col md={8}>
            <MovieReview id={movieData.id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Detailmovie;
