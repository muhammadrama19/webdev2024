  import React, { useState, useRef, useEffect } from "react";
  import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Image,
    Badge,
  } from "react-bootstrap";
  import { useNavigate } from "react-router-dom"; 
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
      award: [],
      image: null,
    });

    const [genresList, setGenresList] = useState([]); // State untuk genres dari backend
    const [actorsList, setActorsList] = useState([]); // State untuk daftar aktor
    const [filteredActors, setFilteredActors] = useState([]); // State untuk hasil pencarian aktor
    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian aktor
    const [awardsList, setAwardsList] = useState([]); // State untuk awards dari backend

    const navigate = useNavigate();

    // Fetch genres dari backend menggunakan useEffect
    useEffect(() => {
      const fetchGenresActorsAwards = async () => {
        try {
          const genresResponse = await fetch("http://localhost:8001/genres");
          const genresData = await genresResponse.json();
          setGenresList(genresData);

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

    const handleAwardChange = (awardName) => {
      // Pastikan award belum dipilih
      if (!formData.awards.includes(awardName)) {
        setFormData((prevState) => ({
          ...prevState,
          awards: [...prevState.awards, awardName],
        }));
      }
    };
    
    const removeAward = (awardName) => {
      setFormData((prevState) => ({
        ...prevState,
        awards: prevState.awards.filter((award) => award !== awardName),
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Buat formData objek baru untuk mengirimkan data ke backend
      const payload = {
        ...formData, 
        genres: formData.genres,  // Mengirim array genres
        actors: formData.actors,  // Mengirim array actors
        award: formData.awards,   // Mengirim array awards
      };
    
      try {
        const response = await fetch("http://localhost:8001/add-drama", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Mengirim data dalam format JSON
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
              <Form.Group className="mb-3">
                <Form.Select
                  name="award"
                  value={formData.award}
                  onChange={handleChange}
                  className="select-award"
                >
                  <option value="">Select Award</option>
                  {awardsList.map((award) => (
                    <option key={award.id} value={award.awards_name}>
                      {award.awards_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

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
