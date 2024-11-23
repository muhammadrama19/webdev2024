import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "./featured.scss";
import Button from "../button/button";
import { useNavigate } from "react-router-dom";


// Lazy load image function
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
  const [fadeClass, setFadeClass] = useState("fade-in"); // Handle fade animation
  const [loading, setLoading] = useState(true); // Loading state for lazy loading

  const navigate = useNavigate(); 

  // Fetch movie data and preload images once
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8001/featured");
        const data = await response.json();
        console.log("Fetched movie data:", data);

        // Preload only the first movie's background image to reduce initial load
        await preloadImage(data[0].background);

        setMovies(data); // Store the array of movies after preloading the first image
        setLoading(false); // Set loading to false after the first image is loaded
      } catch (error) {
        console.error("Error fetching the featured movie:", error);
      }
    };

    fetchMovies(); // Fetch movies once when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  // Set interval to update movie every 10 seconds and handle fade animations
  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setFadeClass("fade-out"); // Trigger fade out

        setTimeout(() => {
          setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length); // Move to the next movie
          setFadeClass("fade-in"); // Trigger fade in
        }, 500); // Duration of fade-out
      }, 10000); // Change movie every 10 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [movies]); // Only run when `movies` array changes

  // Preload the next movie's background when switching to it (lazy loading)
  useEffect(() => {
    if (movies.length > 0) {
      const nextMovie = movies[(currentMovieIndex + 1) % movies.length];
      preloadImage(nextMovie.background); // Preload the next background image
    }
  }, [currentMovieIndex, movies]); // Runs when the current movie changes

  if (loading || movies.length === 0) return <div>Loading...</div>; // Display loading until movies are fetched

  const currentMovie = movies[currentMovieIndex]; // Get the current movie to display

  return (
    <div className={`featured-container ${fadeClass}`}>
      {/* Background Image */}
      <div className="background">
        <img
          src={currentMovie.background || ""}
          alt={currentMovie.title || "No Title"}
          className="background-image"
        />
      </div>

      {/* Movie Poster and Synopsis */}
      <div className="content-overlay">
        <Row>
          <Col md={4} lg={4} sm={2} className="poster-col">
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="movie-poster pt-5"
            />
          </Col>
          <Col md={8} lg={8} sm={3} className="info-col">
            <div className="info">
              <p className="movieTitle">{currentMovie.title}</p>
              <p className="desc">{currentMovie.synopsis}</p>
              <div className="buttons">
                <Button
                  className="mt-3 border-white"
                  variant="primary"
                  onClick={() => navigate(`/movies/${currentMovie.id}`)}
                >
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
