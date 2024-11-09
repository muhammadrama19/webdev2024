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
import { useNavigate, useLocation } from "react-router-dom";
import "../InputDrama/InputDrama.css";
import Select from "react-select"; // Import react-select
import Rating from "react-rating-stars-component"; // Import star rating component

const DramaInput = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: null,
    posterUrl: "",
    status: "",
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
    awards: [],
    backgroundUrl: "",
    imdbScore: 0,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [platformList, setPlatformList] = useState([]);
  const [countriesList, setCountriesList] = useState([]); // State untuk countries dari backend
  const [awardsList, setAwardsList] = useState([]); // State untuk awards dari backend
  const [statusList, setStatusList] = useState([]); // State untuk status dari backend

  useEffect(() => {
    const fetchPlatformsAndCountries = async () => {
      try {
        const platformResponse = await fetch("http://localhost:8001/platforms");
        const platformData = await platformResponse.json();
        setPlatformList(platformData);

        const countriesResponse = await fetch(
          "http://localhost:8001/countries"
        );
        const countriesData = await countriesResponse.json();
        setCountriesList(countriesData);

        const awardsResponse = await fetch("http://localhost:8001/awards");
        const awardsData = await awardsResponse.json();
        setAwardsList(awardsData);

        const statusResponse = await fetch("http://localhost:8001/status");
        const statusData = await statusResponse.json();
        setStatusList(statusData); // Set statusList dengan data dari backend
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPlatformsAndCountries();

    if (location.state && location.state.movieData) {
      const movieData = location.state.movieData;

      const availabilityPlatform = platformList.find(
        (platform) => platform.id === movieData.availability_id
      );

      const selectedCountries = movieData.Countries
        ? movieData.Countries.split(", ").map((countryName) => ({
            label: countryName,
            value: countryName,
          }))
        : [];

      const selectedAwards = movieData.Awards
        ? movieData.Awards.split(", ").map((awardName) => ({
            label: awardName,
            value: awardName,
          }))
        : [];

      const selectedGenres = movieData.Genres
        ? movieData.Genres.split(", ")
        : [];

      const parsedActors = movieData.Actors
        ? movieData.Actors.split(", ").map((actorWithRole) => {
            const [name, role] = actorWithRole
              .match(/(.*?) \((.*?)\)/)
              .slice(1);
            return { name, role };
          })
        : [];

      const selectedStatus = statusList.find(
        (status) => status.id === movieData.status_id
      );

      setFormData({
        id: movieData.id || null,
        posterUrl: movieData.poster || "",
        status: selectedStatus ? selectedStatus.name : "",
        status_id: movieData.status_id || "",
        view: movieData.view || "",
        title: movieData.title || "",
        alternativeTitle: movieData.alt_title || "",
        director: movieData.director || "",
        year: movieData.release_year || "",
        country: selectedCountries,
        synopsis: movieData.synopsis || "",
        availability: availabilityPlatform
          ? availabilityPlatform.platform_name
          : "",
        genres: selectedGenres,
        actors: parsedActors,
        trailer: movieData.trailer || "",
        awards: selectedAwards,
        backgroundUrl: movieData.background || "",
        imdbScore: parseFloat(movieData.imdb_score) || 0,
      });
      setIsEdit(true);
    }
  }, [location.state, platformList, countriesList, awardsList, statusList]);

  const [genresList, setGenresList] = useState([]); // State untuk genres dari backend
  const [actorsList, setActorsList] = useState([]); // State untuk daftar aktor
  const [filteredActors, setFilteredActors] = useState([]); // State untuk hasil pencarian aktor
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan input pencarian aktor
  // const [countriesList, setCountriesList] = useState([]); // State untuk countries dari backend
  // const [platformList, setPlatformList] = useState([]); // State untuk platform dari backend

  // Fetch genres dari backend menggunakan useEffect
  useEffect(() => {
    const fetchGenresActorsAwards = async () => {
      try {
        const statusResponse = await fetch("http://localhost:8001/status");
        const statusData = await statusResponse.json();
        setStatusList(statusData);

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

  const handleActorChange = (actorName, actorRole) => {
    // Pastikan tidak lebih dari 10 aktor yang dipilih dan aktor belum dipilih
    if (
      formData.actors.length < 10 &&
      !formData.actors.some((actor) => actor.name === actorName)
    ) {
      setFormData((prevState) => ({
        ...prevState,
        actors: [...prevState.actors, { name: actorName, role: actorRole }],
      }));
    }
    setSearchTerm(""); // Reset pencarian setelah aktor dipilih
    setFilteredActors([]); // Kosongkan hasil pencarian setelah aktor dipilih
  };

  const handleRoleChange = (actorName, role) => {
    setFormData((prevState) => ({
      ...prevState,
      actors: prevState.actors.map((actor) =>
        actor.name === actorName ? { ...actor, role } : actor
      ),
    }));
  };

  const removeActor = (actorName) => {
    setFormData((prevState) => ({
      ...prevState,
      actors: prevState.actors.filter((actor) => actor.name !== actorName),
    }));
  };

  // const handleActorChange = (actorName) => {
  //   // Pastikan tidak lebih dari 10 aktor yang dipilih dan aktor belum dipilih
  //   if (formData.actors.length < 10 && !formData.actors.includes(actorName)) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       actors: [...prevState.actors, actorName],
  //     }));
  //   }
  //   setSearchTerm(""); // Reset pencarian setelah aktor dipilih
  //   setFilteredActors([]); // Kosongkan hasil pencarian setelah aktor dipilih
  // };

  // const removeActor = (actorName) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     actors: prevState.actors.filter((actor) => actor !== actorName),
  //   }));
  // };

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

  const handleAwardsChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      awards: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const awardsOptions = awardsList.map((awards) => ({
    value: awards.awards_name,
    label: awards.awards_name,
  }));

  const countryOptions = countriesList.map((country) => ({
    value: country.country_name,
    label: country.country_name,
  }));

  const removeAwards = (awardsName) => {
    setFormData((prevState) => ({
      ...prevState,
      awards: prevState.awards.filter((awards) => awards !== awardsName),
    }));
  };

  // Ref untuk kontainer besar
  // const imgRefLarge = useRef(null);
  // const iconRefLarge = useRef(null);
  // const textRefLarge = useRef(null);
  // const containerRefLarge = useRef(null);

  // // Ref untuk kontainer kecil
  // const imgRefSmall = useRef(null);
  // const iconRefSmall = useRef(null);
  // const textRefSmall = useRef(null);
  // const containerRefSmall = useRef(null);

  // const handleImageChange = (event, isSmall) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       image: isSmall ? file : prevState.image,
  //       backgroundImage: !isSmall ? file : prevState.backgroundImage,
  //     }));
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       if (isSmall) {
  //         if (imgRefSmall.current) {
  //           imgRefSmall.current.src = e.target.result;
  //           imgRefSmall.current.style.display = "block";
  //           imgRefSmall.current.style.width = "100%";
  //           imgRefSmall.current.style.height = "auto";
  //         }
  //         if (iconRefSmall.current) {
  //           iconRefSmall.current.style.display = "none";
  //         }
  //         if (textRefSmall.current) {
  //           textRefSmall.current.style.display = "none"; // Sembunyikan teks
  //         }
  //         if (containerRefSmall.current) {
  //           containerRefSmall.current.style.border = "none";
  //         }
  //       } else {
  //         if (imgRefLarge.current) {
  //           imgRefLarge.current.src = e.target.result;
  //           imgRefLarge.current.style.display = "block";
  //           imgRefLarge.current.style.width = "100%";
  //           imgRefLarge.current.style.height = "auto";
  //         }
  //         if (iconRefLarge.current) {
  //           iconRefLarge.current.style.display = "none";
  //         }
  //         if (textRefLarge.current) {
  //           textRefLarge.current.style.display = "none"; // Sembunyikan teks
  //         }
  //         if (containerRefLarge.current) {
  //           containerRefLarge.current.style.border = "none";
  //         }
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     console.error("No file selected");
  //   }
  // };

  const handleRatingChange = (newRating) => {
    setFormData((prevState) => ({
      ...prevState,
      imdbScore: newRating, // This can now be a float (e.g., 3.5)
    }));
  };

  const handleCountryChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      country: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data as a plain JSON object
    const dataToSubmit = {
      view: formData.view,
      status: formData.status,
      title: formData.title,
      alt_title: formData.alternativeTitle,
      director: formData.director,
      release_year: formData.year,
      country: formData.country,
      synopsis: formData.synopsis,
      availability: formData.availability,
      genres: formData.genres, // Array
      actors: formData.actors, // Array
      trailer: formData.trailer,
      awards: formData.awards, // Array
      imdb_score: formData.imdbScore,
      posterUrl: formData.posterUrl, // Using poster URL instead of file
      backgroundUrl: formData.backgroundUrl, // Using background URL instead of file
    };

    try {
      const response = await fetch("http://localhost:8001/add-drama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit), // Send JSON data
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Tampilkan pesan sukses
        navigate("/movie-list"); // Redirect ke halaman movie list jika berhasil
      } else {
        console.error("Error submitting form data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      id: formData.id,
      view: formData.view,
      status: formData.status,
      title: formData.title,
      alt_title: formData.alternativeTitle,
      director: formData.director,
      release_year: formData.year,
      country: formData.country,
      synopsis: formData.synopsis,
      availability: formData.availability,
      genres: formData.genres,
      actors: formData.actors,
      trailer: formData.trailer,
      awards: formData.awards,
      imdb_score: formData.imdbScore,
      posterUrl: formData.posterUrl,
      backgroundUrl: formData.backgroundUrl,
    };

    try {
      const response = await fetch("http://localhost:8001/update-drama", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        navigate("/movie-list");
      } else {
        console.error("Error updating form data:", response.statusText);
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
            <Form.Group className="mb-3">
              <Form.Label>Poster URL</Form.Label>
              <Form.Control
                type="text"
                name="posterUrl"
                placeholder="Enter Poster Image URL"
                value={formData.posterUrl}
                onChange={handleChange}
              />
              {formData.posterUrl && (
                <Image
                  src={formData.posterUrl}
                  alt="Poster Preview"
                  style={{ width: "100%", marginTop: "10px" }}
                  onError={() => setFormData({ ...formData, posterUrl: "" })} // Hide preview if URL is invalid
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                name="status"
                value={formData.status} // Set nilai berdasarkan formData.status
                onChange={handleChange}
              >
                <option value="">Status Movie</option>
                {statusList.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {/* <div className="small-image-upload-container">
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
            </div> */}
            <Form.Group className="mb-3 imdb-score-label">
              <FormLabel className="imdb-score-label">IMDB SCORE</FormLabel>
              <Rating
                count={5}
                value={formData.imdbScore} // Set nilai berdasarkan formData.imdbScore
                onChange={handleRatingChange}
                size={32}
                isHalf={true} // Allow half-star ratings
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
            <div className="select">
              <Form.Group className="mb-3">
                <Select
                  isMulti
                  name="country"
                  options={countryOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formData.country}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                />
              </Form.Group>
            </div>
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
                {genresList.map((genre) => (
                  <Form.Check
                    key={genre.id}
                    type="checkbox"
                    label={genre.name}
                    checked={formData.genres.includes(genre.name)}
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
                      onClick={() => handleActorChange(actor.name, actor.role)}
                    >
                      {actor.name}
                    </li>
                  ))}
                </ul>
              )}
              <div className="selected-actors">
                {formData.actors.map((actor, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Badge
                      bg="info"
                      className="actor-badge"
                      style={{ marginRight: "10px" }}
                    >
                      {actor.name}{" "}
                      <span
                        className="remove-actor"
                        onClick={() => removeActor(actor.name)}
                        style={{ cursor: "pointer" }}
                      >
                        x
                      </span>
                    </Badge>
                    <Form.Control
                      type="text"
                      placeholder="Role"
                      value={actor.role}
                      onChange={(e) =>
                        handleRoleChange(actor.name, e.target.value)
                      }
                      style={{
                        height: "70%",
                        width: "40%",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    />
                  </div>
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
                  options={awardsOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select Awards"
                  value={formData.awards}
                  onChange={handleAwardsChange}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Background URL</Form.Label>
              <Form.Control
                type="text"
                name="backgroundUrl"
                placeholder="Enter Background Image URL"
                value={formData.backgroundUrl}
                onChange={handleChange}
              />
              {formData.backgroundUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Image
                    src={formData.backgroundUrl}
                    alt="Background Preview"
                    style={{ width: "50%" }}
                    onError={() =>
                      setFormData({ ...formData, backgroundUrl: "" })
                    }
                  />
                </div>
              )}
            </Form.Group>

            {/* <div className="image-upload-container">
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
            </div> */}
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
                onClick={isEdit ? handleEdit : handleSubmit}
              >
                {isEdit ? "Update" : "Submit"}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default DramaInput;