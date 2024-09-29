import React, { useState } from 'react';
import { Modal, Button, Container, Row, Col, Form, CloseButton } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import './search.scss';  // Custom styling for blur and modal

const SearchBar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Search Button Icon */}
      <Button variant="none text-white" onClick={handleShow}>
        <Search />
      </Button>

      {/* Fullscreen Modal */}
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Body className="search-modal-body">
          <Container fluid>
            <Row className="d-flex justify-content-end">
              {/* Close Button */}
              <CloseButton variant="white" onClick={handleClose} />
            </Row>
            <Row className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
              {/* Search Input */}
              <Col md={3} lg={6} sm={12} xs={12} className='pb-5'>
                <Form.Group controlId="searchForm">
                  <div className="search-input-wrapper d-flex align-items-center">
                    {/* Search Icon */}
                    <Search style={{ color: 'white', marginRight: '10px' }} />

                    {/* React-Bootstrap Form Control */}
                    <Form.Control
                      type="text"
                      placeholder="Search documentation"
                      className="search-input"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'white',
                        color: 'white',
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchBar;
