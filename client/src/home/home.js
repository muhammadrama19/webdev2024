import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./home.scss";
import DropdownFilterCustom from "../components/dropdownfilter/dropdownFilter";
import Featured from "../components/featured/featured";
import List from "../components/list/list";
import Card from "../components/card/card";
import PaginationCustom from "../components/pagination/pagination";
import { useNavigate } from 'react-router-dom';
import Button from '../components/button/button';

const Home = () => {
  
  
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const sortOptions = ["Ascending", "Descending"];

  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    awards: [],
    countries: [],
    awards: [],
    availability: [],
    status: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    year: '',
    genre: '',
    status: '',
    availability: '',
    country: '',
    awards: '',
    availability: '',
    status: '',
  });
  const [sortOrder, setSortOrder] = useState(''); // New state for sort order
  const handleSortChange = (value) => {
    setSortOrder(value === "Ascending" ? "asc" : value === "Descending" ? "desc" : ''); // Clear sortOrder if no sort selected
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("http://localhost:8001/filters");
        const data = await response.json();
        const decadeOptions = data.years.map(yearRange => `${yearRange.start}-${yearRange.end - 1}`);
        setFilters({
          years: decadeOptions,
          genres: data.genres.map(genre => genre.name),
          awards: data.awards.map(award => award.name),
          countries: data.countries.map(country => country.name),
          availability: data.availability.map(availability => availability.name),
          status: data.status.map(status => status.name),
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
        setTopRated(data); 
      } catch (error) {
        console.error("Error fetching top-rated movies:", error);
      }
    };
    fetchTopRated();
  }, []);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { year, genre, status, availability, country, awards } = selectedFilters;
        const sortParam = sortOrder ? `&sort=${sortOrder}` : ''; 
        const response = await fetch(
          `http://localhost:8001/movies/movie?page=${currentPage}&limit=${limit}&yearRange=${year}&awards=${awards}&genre=${genre}&status=${status}&availability=${availability}&country_release=${country}${sortParam}`
        );
        const data = await response.json();
        setMovies(data.movies);
        const totalFilteredPages = Math.ceil(data.totalCount / limit);
      setTotalPages(totalFilteredPages); // Set the updated total pages
      console.log(data.totalCount);
      
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, [currentPage, selectedFilters, sortOrder]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "year" && value.includes("-")) {
      const [start, end] = value.split("-").map(Number);
      const yearRange = JSON.stringify({ start, end: end }); 
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        year: yearRange, 
      }));
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value || '', 
      }));
    }
    console.log(selectedFilters);
    setCurrentPage(1); // Reset to the first page on filter change
  };
  
  

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`); 
  };

  return (
    <div className="home">
      <Featured type="movie" />
      <Container>
        <Row>
          <Col xs={12} className="listTitle pt-5 font-weight-500">
            Top Rated Movies
          </Col>
          <List title="Top Rated Movies" movies={topRated} />
        </Row>
      </Container>
      

      <Container className="dropdown-container">
        <Row className="align-items-center">
          <Col xs={12} className="label-filter">
            <span>Filter by:</span>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ borderTop: "1px solid var(--primary-color)" }} >
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Year"
              options={filters.years}
              onSelect={(option) => handleFilterChange('year', option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Awards"
              options={filters.awards}
              onSelect={(option) => handleFilterChange('awards', option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Genre"
              options={filters.genres}
              onSelect={(option) => handleFilterChange('genre', option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Sort By:"
              options={sortOptions}
              onSelect={handleSortChange}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Availability"
              options={filters.availability}
              onSelect={(option) => handleFilterChange('availability', option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Status"
              options={filters.status}
              onSelect={(option) => handleFilterChange('status', option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Country"
              options={filters.countries}
              onSelect={(option) => handleFilterChange('country', option)} 
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
