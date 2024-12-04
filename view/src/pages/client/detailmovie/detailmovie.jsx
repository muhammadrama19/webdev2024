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

const  apiUrl = process.env.REACT_APP_API_URL;

const Detailmovie = () => {
  const [movieData, setMovieData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams(); // Mengambil movieId dari URL
  const [userId, setUserId] = useState(null); // Tambahkan userId
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${apiUrl}/movies/detail/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError(true); // Set error state if movie is not found
          }
          return;
        }

        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        setError(true); // Handle fetch error
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");

    if (token && user_id) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token (simplified decoding)
        console.log('Decoded JWT token:', decoded); // Debug: Print decoded token contents
        setIsLoggedIn(true);
        setUserId(user_id);
      } catch (error) {
        console.error('Error decoding token:', error); // Log decoding errors
      }
    } else {
      console.log("Token or user_id not found"); // Log if token/user_id not found
    }
  }, []);

  if (error) {
    return <ErrorPage />;
  }

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movieDetail">
      <CoverDetail srcBackground={movieData.background}/>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={6} lg={8} >
           
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
          <Col md={4} xs={12} sm={12} lg={3}>
            <ReviewBar 
              srcImg={movieData.poster} 
              title={movieData.title} 
              isLoggedIn={isLoggedIn} 
              movieId={id} // Kirim movieId ke ReviewBar
              userId={userId} // Kirim userId ke ReviewBar
            />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8} lg={8} sm={12} xs={12}>
            <ActorSlider actors={movieData.actors} />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={8}  lg={8} sm={12} xs={12}>
           <MediaPlayer link={movieData.trailer || ""}/>
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col md={8}  lg={8} sm={12} xs={12}>
            <MovieReview id={movieData.id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Detailmovie;
