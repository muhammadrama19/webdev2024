import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import './featured.scss';
import Button from '../button/button';


const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

const Featured = () => {
  const [movies, setMovies] = useState([]); // To store the array of movies
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // Track which movie is displayed
  const [fadeClass, setFadeClass] = useState('fade-in'); // Handle fade animation

  // Function to fetch movie data from the endpoint and preload images
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:8001/featured');
      const data = await response.json();
      console.log('Fetched movie data:', data);

      // Preload all background images
      await Promise.all(data.map(movie => preloadImage(movie.background)));

      setMovies(data); // Store the array of movies after images are preloaded
    } catch (error) {
      console.error('Error fetching the featured movie:', error);
    }
  };

  // Fetch movie and set interval to update every 10 seconds
  useEffect(() => {
    fetchMovies(); // Fetch the movies on mount

    const interval = setInterval(() => {
      setFadeClass('fade-out'); // Trigger fade out

      setTimeout(() => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length); // Move to the next movie
        setFadeClass('fade-in'); // Trigger fade in
      }, 500); // Duration of fade-out
    }, 10000); // Change movie every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [movies.length]);

  if (movies.length === 0) return <div>Loading...</div>; // Display loading until movies are fetched

  const currentMovie = movies[currentMovieIndex]; // Get the current movie to display

  return (
    <div className={`featured-container ${fadeClass}`}>
      {/* Background Image */}
      <div className="background">
        <img 
          src={currentMovie.background}
          alt={currentMovie.title}
          className="background-image"
        />
      </div>

      {/* Movie Poster and Synopsis */}
      <div className="content-overlay">
        <Row>
          <Col md={4} className="poster-col">
            <img 
              src={currentMovie.poster}
              alt={currentMovie.title} 
              className="movie-poster pt-5"
            />
          </Col>
          <Col md={8} className="info-col">
            <div className="info">
            <p className="movieTitle">
                {currentMovie.title}
              </p>
              <p className="desc">
                {currentMovie.synopsis}
              </p>
              <div className="buttons">
                <Button className="mt-3 border-white" variant="primary" onClick={() => alert('Info Button')}>
                  See More
                </Button>
     
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Featured;
