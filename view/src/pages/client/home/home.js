import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./home.scss";
import DropdownFilterCustom from "../../../components/dropdownfilter/dropdownFilter";
import Featured from "../../../components/featured/featured";
import List from "../../../components/list/list";
import Card from "../../../components/card/card";
import PaginationCustom from "../../../components/pagination/pagination";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddIcon from '@mui/icons-material/Add';
import Cookies from 'js-cookie';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const sortOptions = ["Ascending", "Descending"];
  const [role, setRole] = useState("");

  useEffect(() => {
    //fetch user role from cookie
    const userRole = Cookies.get("role");
    console.log(userRole);
    setRole(userRole);
  }, []);
  
  // Debouncing effect for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Delay of 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // State for filters
  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    awards: [],
    countries: [],
    availability: [],
    status: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    year: "",
    genre: "",
    status: "",
    availability: "",
    country: "",
    awards: "",
  });

  const [sortOrder, setSortOrder] = useState("");

  const handleSortChange = (value) => {
    setSortOrder(value === "Ascending" ? "asc" : value === "Descending" ? "desc" : "");
  };

  // Fetching filters from backend
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

  // Fetching top-rated movies from backend
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

  // Fetching movies based on filters and search
// Fetching movies based on filters and search
useEffect(() => {
  const fetchMovies = async () => {
    try {
      const { year, genre, status, availability, country, awards } = selectedFilters;
      const sortParam = sortOrder ? `&sort=${sortOrder}` : '';

      // Determine the API endpoint based on the search query
      const url = debouncedSearchQuery
        ? `http://localhost:8001/movies/movie?page=${currentPage}&limit=${limit}&yearRange=${year}&awards=${awards}&genre=${genre}&status=${status}&availability=${availability}&country_release=${country}&search=${encodeURIComponent(debouncedSearchQuery)}${sortParam}`
        : `http://localhost:8001/movies/movie?page=${currentPage}&limit=${limit}&yearRange=${year}&awards=${awards}&genre=${genre}&status=${status}&availability=${availability}&country_release=${country}${sortParam}`;

      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.movies);
      const totalFilteredPages = Math.ceil(data.totalCount / limit);
      setTotalPages(totalFilteredPages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch movies when the component mounts or when filters/search query change
  fetchMovies();
}, [currentPage, selectedFilters, sortOrder, debouncedSearchQuery]);



  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "year" && value.includes("-")) {
      const [start, end] = value.split("-").map(Number);
      const yearRange = JSON.stringify({ start, end });
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        year: yearRange,
      }));
    } else {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value || "",
      }));
    }
    setCurrentPage(1); // Reset to the first page on filter change
  };

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`);
  };

  const handleAdminButtonClick = () => {
    //check the role first
    if (role === "Admin") navigate("/dashboard");
    else navigate("/movie-input");
  };



  return (
    <div className="home">
      <Featured type="movie" />
      <Container>
        <Row >
          <Col xs={12} className="listTitle pt-5 font-weight-500" >
            Top Rated Movies
          </Col>
          <List title="Top Rated Movies" movies={topRated} />
        </Row>
      </Container>

      <Container>
        <Row className="align-items-center">
          <Col xs={12} className="label-filter mt-3">
            <span>Filter by:</span>
          </Col>
        </Row>
        <Row className="align-items-center" style={{ borderTop: "1px solid var(--primary-color)", gap: "1rem" }}>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={2}
              label="Year"
              options={filters.years}
              onSelect={(option) => handleFilterChange("year", option)}
            />
          </Col>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={2}
              label="Awards"
              options={filters.awards}
              onSelect={(option) => handleFilterChange("awards", option)}
            />
          </Col>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={3}
              label="Genre"
              options={filters.genres}
              onSelect={(option) => handleFilterChange("genre", option)}
            />
          </Col>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={2}
              label="Sort By:"
              options={sortOptions}
              onSelect={handleSortChange}
            />
          </Col>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={2}
              label="Availability"
              options={filters.availability}
              onSelect={(option) => handleFilterChange("availability", option)}
            />
          </Col>
          <Col>
            <DropdownFilterCustom
              xs={12} sm={6} md={4} lg={2}
              label="Status"
              options={filters.status}
              onSelect={(option) => handleFilterChange("status", option)}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <DropdownFilterCustom
              label="Country"
              options={filters.countries}
              onSelect={(option) => handleFilterChange("country", option)}
            />
          </Col>
        </Row>
      </Container>

      <Container className="search-container mt-3">
        <Row>
          <Col xs={12}>
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </Col>
        </Row>
      </Container>

      <Container className="card-container mt-5">
        <Row className="justify-content-center pt-4" style={{ borderTop: "1px solid var(--primary-color)" }}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={6} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
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
      </Container>

      <Container className="pagination-container mt-4 mb-4">
        <PaginationCustom
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Container>
      {role === "Admin" ? (
        <Button
          variant="primary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            color: "white",
            backgroundColor: "var(--primary-color)",
            border: "none",
          }}
          onClick={handleAdminButtonClick}
        >
          <AdminPanelSettingsIcon />
        </Button>
      ) : (
        <Button
          variant="primary"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            color: "white",
            backgroundColor: "var(--primary-color)",
            border: "none",
          }}
          onClick={handleAdminButtonClick}
        >
          <AddIcon />
        </Button>
      )}
    </div>
  );
};

export default Home;
