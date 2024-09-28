import React, { useState, useEffect, useC } from "react";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Form,
  CloseButton,
} from "react-bootstrap";
import { Search } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./search.scss";



const SearchBar = () => {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const navigate = useNavigate(); 

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleResultClick = (id) => {
    handleClose(); 
    navigate(`/movies/${id}`); 
  };

  const handleViewAllResultsClick = () => {
    handleClose();
    navigate(`/searchresult`, { state: { results: searchResults, query: debouncedQuery } }); // Pass searchResults and debouncedQuery to SearchResult page
    console.log(searchResults, debouncedQuery); 
  };

  useEffect(() => {
    if (debouncedQuery) {
      const fetchSearchResults = async () => {
        try {
          console.log("debounced for: ", debouncedQuery);
          const response = await axios.get(
            `http://localhost:8001/search?q=${debouncedQuery}`
          );
          setSearchResults(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  const handleClose = () => {
    setShow(false); // Close the modal
    setQuery(""); // Clear the search query
    setDebouncedQuery(""); // Reset the debounced query
    setSearchResults([]); // Clear the search results
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="none text-white" onClick={handleShow}>
        <Search />
      </Button>

      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Body className="search-modal-body">
          <Container fluid>
            <Row className="d-flex justify-content-end">
              <CloseButton variant="white" onClick={handleClose} />
            </Row>
            <Row className="d-flex justify-content-center mt-4">
              <Col md={6} sm={12} xs={12} lg={6}>
                <Form.Group controlId="searchForm">
                  <div className="search-input-wrapper d-flex align-items-center">
                    <Search style={{ color: "white", marginRight: "10px" }} />
                    <Form.Control
                      type="text"
                      placeholder="Search for movies..."
                      className="search-input"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "white",
                        color: "white",
                      }}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Display Search Results */}
            {searchResults.length > 0 && (
              <Row className="d-flex justify-content-center">
                <Col md={6} sm={12} xs={12} lg={6}>
                  <div className="search-results-wrapper">
                    <ul className="search-results-list">
                      {searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="search-result-item"
                          onClick={() => handleResultClick(result.id)} // Navigate to the movie detail on click
                        >
                          <img
                            src={result.poster}
                            alt={result.title}
                            className="search-result-image"
                          />
                          <div className="search-result-content">
                            <span className="search-result-title">
                              {result.title}
                            </span>
                            <div className="search-result-info">
                              <span className="search-result-rating">
                                IMDb: {result.imdb_score}
                              </span>
                              <span className="search-result-year">
                                Release: {result.release_year}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            )}

            {/* View All Results Button */}
            {searchResults.length > 0 && (
              <Row className="d-flex justify-content-center">
                <Col md={6} sm={12} xs={12} lg={6}>
                  <div
                    className="view-all-results"
                    onClick={handleViewAllResultsClick}
                  >
                    View All Results
                  </div>
                </Col>
              </Row>
            )}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchBar;
