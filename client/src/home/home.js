import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './home.scss';
import DropdownFilterCustom from '../components/filter/dropdownfilter';
import Featured from '../components/featured/featured';
import List from '../components/list/list';  // Import List
import Card from '../components/card/card';
import PaginationCustom from '../components/pagination/pagination';

const Home = () => {
  const genres = ["Action", "Comedy", "Drama", "Horror"];
  const status = ["Ongoing", "Completed"];
  const availability = ["Available", "Not Available"];
  const awards = ["Best Picture", "Best Actor", "Best Actress", "Best Director"];

  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);  // State for top-rated movies
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    awards: [],
    countries: []
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('http://localhost:8001/filters');
        const data = await response.json();

        // Transform years into ranges
        const decadeOptions = data.years.map(yearRange => `${yearRange.start}-${yearRange.end - 1}`);
        
        setFilters({
          years: decadeOptions,
          genres: data.genres.map(genre => genre.name),
          awards: data.awards.map(award => award.name),
          countries: data.countries.map(country => country.name)
        });
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8001/movies/movie?page=${currentPage}&limit=${limit}`);
        const data = await response.json();
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalCount / limit));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await fetch('http://localhost:8001/movies/top-rated');
        const data = await response.json();
        setTopRated(data);  // Set top-rated movies
      } catch (error) {
        console.error('Error fetching top rated movies:', error);
      }
    };

    fetchTopRated();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Page changed to: ${page}`);
  };

  return (
    <div className="home">
      <Featured type="movie" />
      <List title="Top Rated Movies" movies={topRated} />  {/* Pass movies prop */}

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
        <Row className="justify-content-center pt-4" style={{ borderTop: '1px solid var(--primary-color)' }}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={6} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
              <Card
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
