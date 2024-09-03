import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, Container, Image } from "react-bootstrap";
import "../InputDrama/InputDrama.css";

const DramaInput = () => {
  const [formData, setFormData] = useState({
    title: "",
    alternativeTitle: "",
    year: "",
    country: "",
    synopsis: "",
    availability: "",
    genres: [],
    actors: [],
    trailer: "",
    award: "",
    image: null,
  });

  const genresList = [
    "Action",
    "Adventure",
    "Romance",
    "Drama",
    "Slice of Life",
  ];
  const actorsList = Array(10).fill("Actor");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenreChange = (genre) => {
    setFormData((prevState) => {
      const genres = prevState.genres.includes(genre)
        ? prevState.genres.filter((g) => g !== genre)
        : [...prevState.genres, genre];
      return { ...prevState, genres };
    });
  };

  const handleActorChange = (actor) => {
    setFormData((prevState) => {
      const actors = prevState.actors.includes(actor)
        ? prevState.actors.filter((a) => a !== actor)
        : [...prevState.actors, actor];
      return { ...prevState, actors };
    });
  };

  const imgRef = useRef(null);
  const iconRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (imgRef.current) {
          imgRef.current.src = e.target.result;
          imgRef.current.style.display = "block";
          imgRef.current.style.width = "100%";
          imgRef.current.style.height = "auto";
          imgRef.current.style.position = "relative";
        }
        if (iconRef.current) {
          iconRef.current.style.display = "none";
        }
        if (containerRef.current) {
          containerRef.current.style.border = "none";
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <Container className="drama-input-container">
      <h2 className="text-center mb-4">Input Drama</h2>
      <Form className="drama-input-form" onSubmit={handleSubmit}>
        <Row className="gy-4">
          <Col md={4}>
            <div className="image-upload-container">
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              ></link>
              <div className="camera-icon" ref={containerRef}>
                <Image
                  ref={imgRef}
                  src="#"
                  alt="Img Preview"
                  style={{ display: "none" }}
                />
                <i className="fa fa-camera" ref={iconRef}></i>
              </div>
              <Form.Group controlId="formFile" className="file-input-container">
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            </div>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="alternativeTitle"
                placeholder="Alternative Title"
                value={formData.alternativeTitle}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                name="synopsis"
                placeholder="Synopsis"
                value={formData.synopsis}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="availability"
                placeholder="Availability"
                value={formData.availability}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Add Genres</Form.Label>
              <div className="genres">
                {genresList.map((genre) => (
                  <Form.Check
                    key={genre}
                    type="checkbox"
                    label={genre}
                    onChange={() => handleGenreChange(genre)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Add Actors (Up to 10)</Form.Label>
              <Form.Control
                type="text"
                name="searchActor"
                placeholder="Search Actor Names"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="trailer"
                placeholder="Link Trailer"
                value={formData.trailer}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                name="award"
                value={formData.award}
                onChange={handleChange}
              >
                <option value="">Select Award</option>
                <option value="Award 1">Award 1</option>
                <option value="Award 2">Award 2</option>
                <option value="Award 3">Award 3</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end form-group-submit">
              <Button variant="secondary" className="back-button me-2" style={{ backgroundColor: '#20283E', borderColor: '#20283E'}}>
                Back
              </Button>
              <Button type="submit" variant="primary" className="submit-button" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722'}}>
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default DramaInput;
