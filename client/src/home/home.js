import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./home.scss";
import DropdownFilterCustom from "../components/filter/dropdownfilter";
import Featured from "../components/featured/featured";
import List from "../components/list/list";
import Card from "../components/card/card";
import PaginationCustom from "../components/pagination/pagination";
import { useNavigate } from 'react-router-dom';
const Home = () => {

  const status = ["Ongoing", "Completed"];
  const availability = ["Available", "Not Available"];

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    awards: [],
    countries: [],
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://localhost:8001/filters");
        const data = await response.json();

        // Transform years into ranges
        const decadeOptions = data.years.map(
          (yearRange) => `${yearRange.start}-${yearRange.end - 1}`
        );

        setFilters({
          years: decadeOptions,
          genres: data.genres.map((genre) => genre.name),
          awards: data.awards.map((award) => award.name),
          countries: data.countries.map((country) => country.name),
        });
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const [topRated, setTopRated] = useState([]);
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await fetch("http://localhost:8001/top-rated");
        const data = await response.json();
        setTopRated(data); // Set top-rated movies
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
      }
    };

    fetchTopRated();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/movies/movie?page=${currentPage}&limit=${limit}`
        );
        const data = await response.json();
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalCount / limit)); // Update total pages
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleCardClick = (id) => {
    navigate(`/movies/${id}`); // Navigate to Detailmovie with movie ID
  };


  return (
    <div className="home">
      <Featured type="movie" />
      <List title="Top Rated Movies" movies={topRated} />

      <Container className="dropdown-container">
        <Row className="align-items-center">
          <Col xs={12} className="label-filter">
            <span>Filter by:</span>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ borderTop: '1px solid var(--primary-color)' }}>
          <Col xs={12} sm={6} md={4} lg={2}>
          <DropdownFilterCustom
        label="Year"
        options={filters.years}
      />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Genres"
              options={filters.genres}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Sort By"
              options={["Latest", "Oldest"]}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="awards"
              options={filters.awards}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Status"
              options={status}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Availability"
              options={availability}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Country"
              options= {filters.countries}
              onSelect={(option) => console.log(option)}
            />
          </Col>
        </Row>
      </Container>

      <Container className="card-container mt-5">
        <Row
          className="justify-content-center pt-4"
          style={{ borderTop: "1px solid var(--primary-color)" }}
        >
          {movies.map((movie) => (
            <Col
              key={movie.id}
              xs={6}
              sm={6}
              md={4}
              lg={3}
              className="mb-4 d-flex justify-content-center"
            >
              <Card
                onClick={() => handleCardClick(movie.id)}
                src={movie.src}
                title={movie.title}
                year={movie.year}
                genres={movie.genres}
                rating={movie.rating}
                views={movie.view}
              />
            </Col>
          ))}
        </Row>

        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Container>
    </div>
  );
};

export default Home;
