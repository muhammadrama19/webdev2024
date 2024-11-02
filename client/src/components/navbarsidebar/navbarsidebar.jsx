import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavbarSidebar.scss'; // Add custom styling as needed

const NavbarSidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="navbar-sidebar-layout">
      {/* Top Navbar */}
      <Navbar >
        <Container fluid>
          <Button variant="outline-light" onClick={toggleSidebar} className="me-2">
            ☰
          </Button>
          <Navbar.Brand as={Link} to="/">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Dashboard</Accordion.Header>
            <Accordion.Body>
              <Nav.Link as={Link} to="/dashboard">Dashboard Home</Nav.Link>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Movies</Accordion.Header>
            <Accordion.Body>
              <Nav.Link as={Link} to="/movie-list">Movie List</Nav.Link>
              <Nav.Link as={Link} to="/validate-drama">Movie Validation</Nav.Link>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Attributes</Accordion.Header>
            <Accordion.Body>
              <Nav.Link as={Link} to="/manage-actor">Actor</Nav.Link>
              <Nav.Link as={Link} to="/manage-genre">Genre</Nav.Link>
              <Nav.Link as={Link} to="/manage-awards">Award</Nav.Link>
              <Nav.Link as={Link} to="/manage-country">Country</Nav.Link>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Review</Accordion.Header>
            <Accordion.Body>
              <Nav.Link as={Link} to="/manage-review">Review</Nav.Link>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Main Content Area */}
      <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Container fluid className="mt-5 pt-3">
          {/* Content here, depending on routing or direct components */}
        </Container>
      </div>
    </div>
  );
};

export default NavbarSidebarLayout;
