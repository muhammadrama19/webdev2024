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
    Modal,
  } from "react-bootstrap";
  import { useNavigate, useLocation } from "react-router-dom";
  import "../InputDrama/InputDrama.css";
  import Select from "react-select"; // Import react-select
  import Rating from "react-rating-stars-component"; // Import star rating component
  import Cookies from 'js-cookie';
  import Swal from 'sweetalert2';

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
      country: [],
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
    const [countriesList, setCountriesList] = useState([]);
    const [awardsList, setAwardsList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [genresList, setGenresList] = useState([]);
    const [actorsList, setActorsList] = useState([]);
    const [filteredActors, setFilteredActors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
      const fetchPlatformsAndCountries = async () => {
        try {
          const platformResponse = await fetch("http://localhost:8001/platforms", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const platformData = await platformResponse.json();
          setPlatformList(platformData);

          const countriesResponse = await fetch("http://localhost:8001/countries", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const countriesData = await countriesResponse.json();
          setCountriesList(countriesData);

          const awardsResponse = await fetch("http://localhost:8001/awards", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const awardsData = await awardsResponse.json();
          setAwardsList(awardsData);

          const statusResponse = await fetch("http://localhost:8001/status", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
          const statusData = await statusResponse.json();
          setStatusList(statusData);

          const actorsResponse = await fetch("http://localhost:8001/actors");
          const actorsData = await actorsResponse.json();
          setActorsList(actorsData);

          const genresResponse = await fetch("http://localhost:8001/genres");
          const genresData = await genresResponse.json();
          setGenresList(genresData);  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchPlatformsAndCountries();
    }, []);
      

    useEffect(() => {
      if (location.state && location.state.movieData && platformList.length && countriesList.length && awardsList.length && statusList.length) {
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
          availability: availabilityPlatform ? availabilityPlatform.platform_name : "",
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

    const handleChange = (e) => {
      const { name, value } = e.target;

  if (name === "year") {
    const yearRegex = /^\d{0,4}$/;
    if (!yearRegex.test(value)) {
      alert("Year must be a 4-digit number and only digits are allowed");
      return;
    }
  }

  if (name === "view") {
    const reviewRegex = /^\d*$/; // Regex untuk angka bulat
    if (!reviewRegex.test(value)) {
      alert("Value must be an integer");
      return;
      // setReviewWarning("Total Views must be a valid integer."); // Set peringatan jika input salah
      // return;
    // } else {
    //   setReviewWarning(""); // Hapus peringatan jika input benar
    }
  }

      setFormData({
        ...formData,
        [name]: value,
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
      if (
        formData.actors.length < 10 &&
        !formData.actors.some((actor) => actor.name === actorName)
      ) {
        setFormData((prevState) => ({
          ...prevState,
          actors: [...prevState.actors, { name: actorName, role: actorRole }],
        }));
      }
      setSearchTerm("");
      setFilteredActors([]);
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

    const handleSearchActor = (e) => {
      const searchValue = e.target.value;
      setSearchTerm(searchValue);

      if (searchValue.length > 0) {
        const filtered = actorsList.filter((actor) =>
          actor.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredActors(filtered);
      } else {
        setFilteredActors([]);
      }
    };

    // const handleAwardsChange = (selectedOptions) => {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     awards: selectedOptions
    //       ? selectedOptions.map((option) => option.value)
    //       : [],
    //   }));
    //   console.log()
    // };

    const awardsOptions = awardsList.map((awards) => ({
      value: awards.awards_name,
      label: awards.awards_name,
    }));

    const countryOptions = countriesList.map((country) => ({
      value: country.country_name,
      label: country.country_name,
    }));

    const handleRatingChange = (newRating) => {
      setFormData((prevState) => ({
        ...prevState,
        imdbScore: newRating, // This can now be a float (e.g., 3.5)
      }));
    };

    const handleCountryChange = (selectedOptions) => {
      setFormData((prevState) => ({
        ...prevState,
        country: selectedOptions ? selectedOptions : [], // Simpan objek lengkap, bukan hanya nilai
      }));
    };
    
    const handleAwardsChange = (selectedOptions) => {
      setFormData((prevState) => ({
        ...prevState,
        awards: selectedOptions ? selectedOptions : [], // Simpan objek lengkap, bukan hanya nilai
      }));
    };
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const isEmpty = (value) => !value || /^\s*$/.test(value);
    
      // List field yang belum diisi
      const fieldsToCheck = {
        posterUrl: "Poster URL",
        status: "Status",
        view: "Total Views",
        title: "Title",
        director: "Director Name",
        year: "Year",
        country: "Country",
        synopsis: "Synopsis",
        availability: "Availability",
        genres: "Genres",
        actors: "Actors",
        trailer: "Trailer",
        backgroundUrl: "Background URL",
        imdbScore: "IMDB Score"
      };
    
      // Cek setiap field dan tambahkan ke daftar `missingFields` jika belum diisi
      const newMissingFields = Object.keys(fieldsToCheck).filter((field) => {
        if (field === "country" || field === "genres" || field === "actors") {
          return formData[field].length === 0;
        }
        return isEmpty(formData[field]) || (field === "imdbScore" && formData.imdbScore === 0);
      }).map((field) => fieldsToCheck[field]);
    
      // Tambahkan validasi untuk role dari setiap actor
      formData.actors.forEach((actor, index) => {
        if (isEmpty(actor.role)) {
          newMissingFields.push(`Role for actor "${actor.name}"`);
        }
      });
    
      // Tampilkan modal jika ada field yang kosong atau role actor yang belum diisi
      if (newMissingFields.length > 0) {
        setMissingFields(newMissingFields);
        setShowModal(true);
        return;
      }
    
      // Lanjutkan proses submit jika semua validasi terpenuhi
      try {
        const countryValues = formData.country.map((option) => option.value);
        const awardsValues = formData.awards.map((option) => option.value);
    
        const dataToSubmit = {
          view: formData.view,
          status: formData.status,
          title: formData.title,
          alt_title: formData.alternativeTitle,
          director: formData.director,
          release_year: formData.year,
          country: countryValues,
          synopsis: formData.synopsis,
          availability: formData.availability,
          genres: formData.genres,
          actors: formData.actors,
          trailer: formData.trailer,
          awards: awardsValues,
          imdb_score: formData.imdbScore,
          posterUrl: formData.posterUrl,
          backgroundUrl: formData.backgroundUrl,
        };
    
        const response = await fetch("http://localhost:8001/add-drama", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
          credentials: "include"
        });
    
        if (response.ok) {
          const result = await response.json();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "Data has been added",
          });
          console.log(result.message);
    
          const role = Cookies.get("role");
          if (role === "Admin") {
            navigate("/movie-list");
          } else {
            navigate("/");
          }
        } else {
          console.error("Error submitting form data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };  
    

    const handleEdit = async (e) => {
      e.preventDefault();
    
      // Extract values for country and awards
      const countryValues = formData.country.map((option) => option.value);
      const awardsValues = formData.awards.map((option) => option.value);
      const dataToSubmit = {
        id: formData.id,
        view: formData.view,
        status: formData.status,
        title: formData.title,
        alt_title: formData.alternativeTitle,
        director: formData.director,
        release_year: formData.year,
        country: countryValues, // Send array of country names
        synopsis: formData.synopsis,
        availability: formData.availability,
        genres: formData.genres,
        actors: formData.actors,
        trailer: formData.trailer,
        awards: awardsValues, // Send array of award names
        imdb_score: formData.imdbScore,
        posterUrl: formData.posterUrl,
        backgroundUrl: formData.backgroundUrl,
      };
    
      try {
        const response = await fetch("http://localhost:8001/update-drama", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
          credentials: "include"
        });
    
        if (response.ok) {
          const result = await response.json();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "Data has been updated",
          });
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
      const role = Cookies.get("role");
          
          // Redirect berdasarkan peran
          if (role === "Admin") {
            navigate("/movie-list"); // Jika admin, ke halaman movie list
          } else {
            navigate("/"); // Jika user biasa, ke halaman home
          }
    };

    return (
      <Container className="drama-input-container">
        <h2 className="text-center mb-4">{isEdit ? "Edit Drama" : "Input Drama"}</h2>
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
                    id="country-select" // Tambahkan id unik
                    name="country"
                    options={countryOptions}
                    className="basic-multi-select country-dropdown"
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
                    id="award-select" // Tambahkan id unik
                    options={awardsOptions}
                    className="basic-multi-select award-dropdown"
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
          {/* Modal untuk menampilkan field yang belum diisi */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Form Incomplete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please fill in the following required fields:</p>
              <ul>
                {missingFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </Container>
    );
  };

  export default DramaInput;
