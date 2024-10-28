import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Image,
  Badge,
  FormLabel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../InputDrama/InputDrama.css";
import Select from 'react-select';  // Import react-select  
import Rating from 'react-rating-stars-component';  // Import star rating component


const DramaInput = () => {
  const [formData, setFormData] = useState({
    view: "",
    title: "",
    alternativeTitle: "",
    director: "",
    year: "",
    country: "",
    synopsis: "",
    availability: "",
    genres: [],
    actors: [],
    trailer: "",
    award: [],
    image: null,
    imdbScore: 0, 
  });

  const [genresList, setGenresList] = useState([]); // State untuk genres dari backend
  const [actorsList, setActorsList] = useState([]); // State untuk daftar aktor
  const [filteredActors, setFilteredActors] = useState([]); // State untuk hasil pencarian aktor
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian aktor
  const [awardsList, setAwardsList] = useState([]); // State untuk awards dari backend
  const [countriesList, setCountriesList] = useState([]); // State untuk countries dari backend
  const [platformList, setPlatformList] = useState([]); // State untuk platform dari backend

  const navigate = useNavigate();

  // Fetch genres dari backend menggunakan useEffect
  useEffect(() => {
    const fetchGenresActorsAwards = async () => {
      try {
        const genresResponse = await fetch("http://localhost:8001/genres");
        const genresData = await genresResponse.json();
        setGenresList(genresData);

        const platformResponse = await fetch("http://localhost:8001/platforms");
        const platformData = await platformResponse.json();
        setPlatformList(platformData);

        const countriesResponse = await fetch(
          "http://localhost:8001/countries"
        );
        const countriesData = await countriesResponse.json();
        setCountriesList(countriesData);

        const actorsResponse = await fetch("http://localhost:8001/actors");
        const actorsData = await actorsResponse.json();
        setActorsList(actorsData);

        const awardsResponse = await fetch("http://localhost:8001/awards");
        const awardsData = await awardsResponse.json();
        setAwardsList(awardsData); // Set Awards List dengan data dari backend
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGenresActorsAwards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

  // Validasi khusus untuk "Year" field
  if (name === "year") {
    const yearRegex = /^\d{0,4}$/; // Memungkinkan 0 hingga 4 digit angka
    if (!yearRegex.test(value)) {
      alert("Year must be a 4-digit number and only digits are allowed");
      return;
    }
  }

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

  const handleActorChange = (actorName) => {
    // Pastikan tidak lebih dari 10 aktor yang dipilih dan aktor belum dipilih
    if (formData.actors.length < 10 && !formData.actors.includes(actorName)) {
      setFormData((prevState) => ({
        ...prevState,
        actors: [...prevState.actors, actorName],
      }));
    }
    setSearchTerm(""); // Reset pencarian setelah aktor dipilih
    setFilteredActors([]); // Kosongkan hasil pencarian setelah aktor dipilih
  };

  const removeActor = (actorName) => {
    setFormData((prevState) => ({
      ...prevState,
      actors: prevState.actors.filter((actor) => actor !== actorName),
    }));
  };

  const handleSearchActor = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter aktor berdasarkan input pengguna
    if (searchValue.length > 0) {
      const filtered = actorsList.filter((actor) =>
        actor.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredActors(filtered);
    } else {
      setFilteredActors([]); // Kosongkan hasil pencarian jika input kosong
    }
  };

  const handleAwardChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      award: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    }));
  };

  const awardOptions = awardsList.map(award => ({
    value: award.awards_name,
    label: award.awards_name,
  }));


  const removeAward = (awardName) => {
    setFormData((prevState) => ({
      ...prevState,
      awards: prevState.award.filter((award) => award !== awardName),
    }));
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

  const handleRatingChange = (newRating) => {
    setFormData((prevState) => ({
      ...prevState,
      imdbScore: newRating,  // This can now be a float (e.g., 3.5)
    }));
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads
    const formDataObj = new FormData();
    formDataObj.append('view', formData.view);
    formDataObj.append('title', formData.title);
    formDataObj.append('alt_title', formData.alternativeTitle);
    formDataObj.append('director', formData.director);
    formDataObj.append('release_year', formData.year);
    formDataObj.append('country', formData.country);
    formDataObj.append('synopsis', formData.synopsis);
    formDataObj.append('availability', formData.availability);
    formDataObj.append('genres', formData.genres); // Array
    formDataObj.append('actors', formData.actors); // Array
    formDataObj.append('trailer', formData.trailer);
    formDataObj.append('award', formData.award); // Array
    formDataObj.append('imdb_score', formData.imdbScore);
    
    if (formData.image) {
      formDataObj.append('poster', formData.image); // Poster image file
    }
    if (formData.backgroundImage) {
      formDataObj.append('background', formData.backgroundImage); // Background image file
    }

    try {
      const response = await fetch("http://localhost:8001/add-drama", {
        method: "POST",
        body: formDataObj, // Send FormData object
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Tampilkan pesan sukses
        // Redirect ke halaman movie list jika berhasil
        navigate("/movie-list");
      } else {
        console.error("Error submitting form data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleBack = () => {
    navigate("/movie-list"); // Redirect to movie-list on Back button click
  };

  return (
    <Container className="drama-input-container">
      <h2 className="text-center mb-4">Input Drama</h2>
      <Form className="drama-input-form" onSubmit={handleSubmit}>
        <Row className="gy-4 justify-content-center">
          {/* Kontainer kecil */}
          <Col md={2}>
            <div className="small-image-upload-container">
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              ></link>
              <div className="small-camera-icon" ref={containerRefSmall}>
                <Image
                  ref={imgRefSmall}
                  src="#"
                  alt="Small Img Preview"
                  style={{ display: "none" }}
                />
                <i className="fa fa-camera" ref={iconRefSmall}></i>
                <span ref={textRefSmall} className="upload-text">
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
            <Form.Group className="mb-3 imdb-score-label">
              <FormLabel className="imdb-score-label">IMDB SCORE</FormLabel>
              <Rating
                count={5}
                value={formData.imdbScore}
                onChange={handleRatingChange}
                size={32}
                isHalf={true}                     // Allow half-star ratings
                fractions={2}   
                activeColor="#ffd700"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="view"
                placeholder="Total Views"
                value={formData.view}
                onChange={handleChange}
                className="view-input"
              />
            </Form.Group>
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
                name="director"
                placeholder="Director Name"
                value={formData.director}
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
              <Form.Select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countriesList.map((country) => (
                  <option key={country.id} value={country.country_name}>
                    {country.country_name}
                  </option>
                ))}
              </Form.Select>
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
              <Form.Select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="">Select Availability</option>
                {platformList.map((platform) => (
                  <option key={platform.id} value={platform.platform_name}>
                    {platform.platform_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Add Genres</Form.Label>
              <div className="genres">
                {/* Looping genres dari state genresList */}
                {genresList.map((genre) => (
                  <Form.Check
                    key={genre.id}
                    type="checkbox"
                    label={genre.name}
                    onChange={() => handleGenreChange(genre.name)}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>

          {/* Kontainer besar */}
          <Col md={4}>
            <Form.Group className="mb-3" style={{ position: "relative" }}>
              <Form.Label>Add Actors (Up to 10)</Form.Label>
              <Form.Control
                type="text"
                name="searchActor"
                placeholder="Search Actor Names"
                value={searchTerm}
                onChange={handleSearchActor}
                autoComplete="off"
              />
              {filteredActors.length > 0 && (
                <ul className="actor-suggestions">
                  {filteredActors.map((actor) => (
                    <li
                      key={actor.id}
                      onClick={() => handleActorChange(actor.name)}
                    >
                      {actor.name}
                    </li>
                  ))}
                </ul>
              )}
              <div className="selected-actors">
                {formData.actors.map((actor, index) => (
                  <Badge
                    key={index}
                    bg="info"
                    className="actor-badge"
                    onClick={() => removeActor(actor)}
                  >
                    {actor} <span className="remove-actor">x</span>
                  </Badge>
                ))}
              </div>
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
            {/* React-Select for multiple awards */}
            <div className="select">
            <Form.Group className="mb-3">
              <Select
                isMulti
                name="awards"
                options={awardOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Awards" 
                value={awardOptions.filter(option => formData.award.includes(option.value))}
                onChange={handleAwardChange}
              />
            </Form.Group>
            </div> 

            <div className="image-upload-container">
              <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              ></link>
              <div className="camera-icon" ref={containerRefLarge}>
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
                onClick={handleBack} // Use handleBack function
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="submit-button"
                style={{ backgroundColor: "#ff5722", borderColor: "#ff5722" }}
                onClick={handleSubmit} // Use handleSubmit function
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
