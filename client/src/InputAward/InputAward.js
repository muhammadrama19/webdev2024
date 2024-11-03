import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Pagination } from 'react-bootstrap';

const AwardManager = () => {
  const [awards, setAwards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [awardsPerPage] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardsName, setAwardsName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [awardsYears, setAwardsYears] = useState('');

  // Fetch awards data
  const fetchAwards = async () => {
    try {
      const response = await fetch('http://localhost:8001/awards');
      const data = await response.json();
      setAwards(data);
    } catch (error) {
      console.error("Error fetching awards:", error);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  // Handle Add Award
  const handleAddAward = async () => {
    if (!awardsName || !countryName || !awardsYears) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/awards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ awards_name: awardsName, country_name: countryName, awards_years: awardsYears }),
      });
      if (response.ok) {
        await fetchAwards();
        setShowAddModal(false);
        alert("Award added successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error adding award:", error);
    }
  };

  // Handle Update Award
  const handleUpdateAward = async () => {
    if (!awardsName || !countryName || !awardsYears) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8001/awards/${selectedAward.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ awards_name: awardsName, country_name: countryName, awards_years: awardsYears }),
      });
      if (response.ok) {
        await fetchAwards();
        setShowUpdateModal(false);
        alert("Award updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error updating award:", error);
    }
  };

  // Handle Delete Award
  const handleDeleteAward = async (id) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        const response = await fetch(`http://localhost:8001/awards/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          await fetchAwards();
          alert("Award deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      } catch (error) {
        console.error("Error deleting award:", error);
      }
    }
  };

  // Pagination Logic
  const indexOfLastAward = currentPage * awardsPerPage;
  const indexOfFirstAward = indexOfLastAward - awardsPerPage;
  const currentAwards = awards.filter(award =>
    award.awards_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(indexOfFirstAward, indexOfLastAward);

  const totalPages = Math.ceil(awards.length / awardsPerPage);

  return (
    <div className="container">
      <h1>Awards Manager</h1>
      <input
        type="text"
        placeholder="Search Awards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />
      <Button onClick={() => setShowAddModal(true)} variant="primary" className="mb-3">Add Award</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Award Name</th>
            <th>Country</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAwards.map(award => (
            <tr key={award.id}>
              <td>{award.id}</td>
              <td>{award.awards_name}</td>
              <td>{award.country_name}</td>
              <td>{award.awards_years}</td>
              <td>
                <Button variant="warning" onClick={() => {
                  setSelectedAward(award);
                  setAwardsName(award.awards_name);
                  setCountryName(award.country_name);
                  setAwardsYears(award.awards_years);
                  setShowUpdateModal(true);
                }} style={{ marginRight: '10px' }}>Update</Button>
                <Button variant="danger" onClick={() => handleDeleteAward(award.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.Prev onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} />
      </Pagination>

      {/* Add Award Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Award</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAwardsName">
              <Form.Label>Award Name</Form.Label>
              <Form.Control type="text" value={awardsName} onChange={(e) => setAwardsName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formCountryName">
              <Form.Label>Country Name</Form.Label>
              <Form.Control type="text" value={countryName} onChange={(e) => setCountryName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formAwardsYears">
              <Form.Label>Award Year</Form.Label>
              <Form.Control type="number" value={awardsYears} onChange={(e) => setAwardsYears(e.target.value)} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddAward}>Add Award</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Award Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Award</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdateAwardsName">
              <Form.Label>Award Name</Form.Label>
              <Form.Control type="text" value={awardsName} onChange={(e) => setAwardsName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formUpdateCountryName">
              <Form.Label>Country Name</Form.Label>
              <Form.Control type="text" value={countryName} onChange={(e) => setCountryName(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formUpdateAwardsYears">
              <Form.Label>Award Year</Form.Label>
              <Form.Control type="number" value={awardsYears} onChange={(e) => setAwardsYears(e.target.value)} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateAward}>Update Award</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AwardManager;
