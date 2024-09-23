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

  // Ref untuk kontainer besar
  const imgRefLarge = useRef(null);
  const iconRefLarge = useRef(null);
  const textRefLarge = useRef(null);
  const containerRefLarge = useRef(null);

  // Ref untuk kontainer kecil
  const imgRefSmall = useRef(null);
  const iconRefSmall = useRef(null);
  const textRefSmall = useRef(null);
  const containerRefSmall = useRef(null);

  // Fungsi untuk menangani gambar berdasarkan ukuran kontainer
  const handleImageChange = (event, isSmall) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (isSmall) {
          if (imgRefSmall.current) {
            imgRefSmall.current.src = e.target.result;
            imgRefSmall.current.style.display = "block";
            imgRefSmall.current.style.width = "100%";
            imgRefSmall.current.style.height = "auto";
          }
          if (iconRefSmall.current) {
            iconRefSmall.current.style.display = "none";
          }
          if (textRefSmall.current) {
            textRefSmall.current.style.display = "none"; // Sembunyikan teks
          }
          if (containerRefSmall.current) {
            containerRefSmall.current.style.border = "none";
          }
        } else {
          if (imgRefLarge.current) {
            imgRefLarge.current.src = e.target.result;
            imgRefLarge.current.style.display = "block";
            imgRefLarge.current.style.width = "100%";
            imgRefLarge.current.style.height = "auto";
          }
          if (iconRefLarge.current) {
            iconRefLarge.current.style.display = "none";
          }
          if (textRefLarge.current) {
            textRefLarge.current.style.display = "none"; // Sembunyikan teks
          }
          if (containerRefLarge.current) {
            containerRefLarge.current.style.border = "none";
          }
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
        <Row className="gy-4 justify-content-center">
          {/* Kontainer kecil */}
          <Col md={2}>
            <div className="small-image-upload-container">
              <div className="small-camera-icon" ref={containerRefSmall}>
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                ></link>
                <Image
                  ref={imgRefSmall}
                  src="#"
                  alt="Small Img Preview"
                  style={{ display: "none" }}
                />
                <i className="fa fa-camera" ref={iconRefSmall}></i>
                <span ref={textRefLarge} className="upload-text">
                  Upload Poster Here
                </span>
              </div>
              <Form.Group
                controlId="formFileSmall"
                className="small-file-input-container"
              >
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, true)}
                />
              </Form.Group>
            </div>
          </Col>

          {/* Form input */}
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

          {/* Kontainer besar */}
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
            <div className="image-upload-container">
              <div className="camera-icon" ref={containerRefLarge}>
                <link
                  rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                ></link>
                <Image
                  ref={imgRefLarge}
                  src="#"
                  alt="Large Img Preview"
                  style={{ display: "none" }}
                />
                <i className="fa fa-camera" ref={iconRefLarge}></i>
                <span ref={textRefLarge} className="upload-text">
                  Upload Background Movie Image Here
                </span>
              </div>
              <Form.Group controlId="formFile" className="file-input-container">
                <Form.Control
                  type="file"
                  onChange={(e) => handleImageChange(e, false)}
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-end form-group-submit">
              <Button
                variant="secondary"
                className="back-button me-2"
                style={{ backgroundColor: "#545858", borderColor: "#20283E" }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="submit-button"
                style={{ backgroundColor: "#ff5722", borderColor: "#ff5722" }}
              >
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
