import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Modal, Spinner, Form } from 'react-bootstrap';
import PaginationCustom from "../components/pagination/pagination"; // Import your custom pagination component

const Countries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryName, setCountryName] = useState("");
  const [showCount] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:8001/countries");
        const data = await response.json();
        console.log("Fetched countries:", data); // Debugging log
        setCountries(data);
        setLoading(false); // Stop loading once data is fetched
        setTotalPages(Math.ceil(data.length / showCount)); // Set total pages based on fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchCountries(); // Call the function to fetch data
  }, [showCount]);

  const handleShowUpdate = (country) => {
    setSelectedCountry(country);
    setCountryName(country.country_name || ""); // Ensure countryName is initialized properly
    setShowUpdateModal(true);
  };

  const handleUpdateCountry = async () => {
    if (!countryName) {
      alert("Country name is required"); // Validate input
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/countries/${selectedCountry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country_name: countryName }),
      });
      if (response.ok) {
        const updatedCountry = await response.json();
        setCountries((prevCountries) =>
          prevCountries.map((country) =>
            country.id === selectedCountry.id ? { ...country, country_name: countryName } : country
          )
        );
        setShowUpdateModal(false);
        alert(updatedCountry.message); // Show success message
      } else {
        const errorData = await response.json();
        alert(errorData.error); // Show error message
      }
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  const handleDeleteCountry = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        const response = await fetch(`http://localhost:8001/countries/delete/${id}`, {
          method: 'PUT', // Use PUT method for soft delete
          headers: { "Content-Type": "application/json" },
          credentials: 'include', // Include credentials (cookies)
        });
        if (response.ok) {
          setCountries((prevCountries) => prevCountries.filter((country) => country.id !== id));
          alert("Country deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(errorData.error); // Show error message
        }
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate which countries to display based on the current page
  const indexOfLastCountry = currentPage * showCount;
  const indexOfFirstCountry = indexOfLastCountry - showCount;

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.country_name && country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update total pages based on filtered data
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCountries.length / showCount));
  }, [filteredCountries, showCount]);

  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

  return (
    <Container className="country-list" style={{ padding: '20px' }}>
      <h2 className="my-4" style={{ textAlign: 'center' }}>Country List</h2>

      <Form.Control
        type="text"
        placeholder="Search countries..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <Spinner animation="border" variant="primary" style={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <Table striped bordered hover responsive className="text-center" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Country Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCountries.map((country) => (
              <tr key={country.id}>
                <td>{country.id}</td>
                <td>{country.country_name}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowUpdate(country)} style={{ marginRight: '10px' }}>
                    Update
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteCountry(country.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationCustom
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Update Modal */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="countryName">
            <Form.Label>Country Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country name"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateCountry}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Countries;