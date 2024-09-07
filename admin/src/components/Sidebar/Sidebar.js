import React, { useState } from "react";
import { Container, Row, Col, ListGroup, Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar Container */}
        <Col xs={8} md={3} lg={2} className="bg-white sidebar p-2 vh-100 position-fixed">
          <Row className="m-2 d-flex align-items-center">
            <Col xs="auto">
              <i className="bi bi-bootstrap-fill me-3 fs-4"></i>
            </Col>
            <Col>
              <span className="brand-name fs-4">Lalajo Euy</span>
            </Col>
          </Row>
          <hr className="text-dark" />
          <ListGroup variant="flush">
            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                <i className="bi bi-speedometer2 fs-5 me-3"></i>
                <span>Dashboard</span>
              </Nav.Link>
            </ListGroup.Item>

            <Accordion className="sidebar-accordion">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="d-flex align-items-center">
                  <i className="bi bi-house fs-5 me-3"></i>
                  <span>Drama</span>
                </Accordion.Header>
                <Accordion.Body className="p-0 ps-3" >
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-2 px-3 ">
                      <Nav.Link as={Link} to="/drama-input" className="submenu-item">
                        Input Drama
                      </Nav.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-2 px-3">
                      <Nav.Link as={Link} to="/drama-list" className="submenu-item">
                        List Drama
                      </Nav.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-2 px-3">
                      <Nav.Link as={Link} to="/drama-validasi" className="submenu-item">
                        Validasi Drama
                      </Nav.Link>
                    </ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/country-input" className="d-flex align-items-center">
                <i className="bi bi-table fs-5 me-3"></i>
                <span>Countries</span>
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/award-input" className="d-flex align-items-center">
                <i className="bi bi-clipboard-data fs-5 me-3"></i>
                <span>Awards</span>
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/genre-input" className="d-flex align-items-center">
                <i className="bi bi-clipboard-data fs-5 me-3"></i>
                <span>Genres</span>
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/actor-input" className="d-flex align-items-center">
                <i className="bi bi-clipboard-data fs-5 me-3"></i>
                <span>Actors</span>
              </Nav.Link>
            </ListGroup.Item>
            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/review-manager" className="d-flex align-items-center">
                <i className="bi bi-clipboard-data fs-5 me-3"></i>
                <span>Reviews</span>
              </Nav.Link>
            </ListGroup.Item>

            <Accordion className="sidebar-accordion">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="d-flex align-items-center">
                  <i className="bi bi-people fs-5 me-3"></i>
                  <span>Pengaturan</span>
                </Accordion.Header>
                <Accordion.Body className="p-0 ps-3">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="py-2 px-3">
                      <Nav.Link as={Link} to="/user-settings" className="submenu-item">
                        User
                      </Nav.Link>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-2 px-3">
                      <Nav.Link as={Link} to="/pengaturan-user" className="submenu-item">
                        Pengaturan User
                      </Nav.Link>
                    </ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <ListGroup.Item className="py-2">
              <Nav.Link as={Link} to="/logout" className="d-flex align-items-center">
                <i className="bi bi-power fs-5 me-3"></i>
                <span>Logout</span>
              </Nav.Link>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        {/* Main Content Area */}
        <Col xs={12} md={{ span: 9, offset: 3 }} lg={{ span: 10, offset: 2 }} className="p-3">
          {/* Tambahkan komponen lain atau konten halaman di sini */}
        </Col>
      </Row>
    </Container>
  );
}

export default Sidebar;
