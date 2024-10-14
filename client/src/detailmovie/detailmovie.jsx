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
import Cookies from 'js-cookie';

const Detailmovie = () => {
  const [movieData, setMovieData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams(); // Mengambil movieId dari URL
  const [userId, setUserId] = useState(null); // Tambahkan userId

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8001/movies/detail/${id}`); 
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetail();
  }, [id]); 

  // Cek apakah pengguna sudah login
  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");
    console.log('Token from cookie:', token); // Debug: Pastikan token dicetak di console
    console.log('User ID from cookie:', user_id); // Debug: Pastikan user_id dicetak di console
  
    if (token && user_id) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        console.log('Decoded JWT token:', decoded); // Debug: Lihat isi token yang didecode
  
        setIsLoggedIn(true);
        setUserId(user_id); // Set userId dari cookie
      } catch (error) {
        console.error('Error decoding token:', error); // Jika ada error saat decoding
      }
    } else {
      console.log("Token or user_id not found"); // Jika token atau user_id tidak ditemukan
    }
  }, []);
  

  if (!movieData) {
    return <div>Loading...</div>;
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
