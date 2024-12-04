import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DropdownFilterCustom from "../../../components/dropdownfilter/dropdownFilter";
import Card from "../../../components/card/card";
import { useNavigate, useLocation } from 'react-router-dom';
import "./searchResult.scss";

const SearchResult = () => {

  const sortOptions = ["Ascending", "Descending"];
  const location = useLocation();
  const searchResults = location.state.results; 
  const searchQuery = location.state.query;


  const [sortOrder, setSortOrder] = useState(''); // New state for sort order
  const handleSortChange = (value) => {
    setSortOrder(value === "Ascending" ? "asc" : value === "Descending" ? "desc" : ''); // Clear sortOrder if no sort selected
  };



  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`); 
  };

  return (
    <div className="home">

      <Container>
        <Row>
          <Col className="titleSearch pt-5 font-weight-500">
            <span>Search Result for:  "{searchQuery}" </span>
          </Col>
        </Row>
      </Container>


      <Container className="card-container mt-5">
        <Row
          className="justify-content-center pt-4"
          style={{ borderTop: "1px solid var(--primary-color)" }}
        >
                     <DropdownFilterCustom
              label="Sort By:"
              options={sortOptions}
              onSelect={handleSortChange}
            />
          {searchResults.map((result) => (
            <Col
              key={result.id}
              xs={6}
              sm={6}
              md={4}
              lg={3}
              className="mb-4 d-flex justify-content-center"
            >
              <Card
                onClick={() => handleCardClick(result.id)}
                src={result.poster}
                title={result.title}
                year={result.release_year}
                genres={result.genres}
                rating={result.imdb_score}
                views={result.view}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default SearchResult;
