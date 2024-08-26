import React, { useState } from "react";
import InputGambar from "./InputGambar";
import InputText from "./InputText";
import Textarea from "./TextArea";
import Select from "./Select";
import CheckboxGroup from "./CheckboxGroup";
import InputActor from "./InputActor";
import Sidebar from "./Sidebar"; 
import SubmitButton from "./SubmitButton";  // Import SubmitButton
import BackButton from "./BackButton";      // Import BackButton
import "../styles/dramaInput.css";

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

  const genresList = ["Action", "Adventure", "Romance", "Drama", "Slice of Life"];
  const actorsList = [
    {
      name: "Robert Downey junior",
      image: "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_.jpg"
    },
    {
      name: "Brad Pitt",
      image: "https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_.jpg"
    },
    // tambahkan aktor lainnya...
  ];
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <form className="drama-input-form" onSubmit={handleSubmit}>
      <Sidebar />
      <div className="form-left">
        <InputGambar 
          onImageChange={(e) => 
            setFormData({ ...formData, image: e.target.files[0] })
          } 
        />
      </div>
      <div className="form-center">
        <InputText
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <InputText
          name="alternativeTitle"
          value={formData.alternativeTitle}
          onChange={handleChange}
          placeholder="Alternative Title"
        />
        <InputText
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
        />
        <InputText
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
        />
        <Textarea
          name="synopsis"
          value={formData.synopsis}
          onChange={handleChange}
          placeholder="Synopsis"
        />
        <InputText
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          placeholder="Availability"
        />
        <CheckboxGroup
          label="Add Genres"
          options={genresList}
          selectedOptions={formData.genres}
          onChange={handleGenreChange}
        />
      </div>
      <div className="form-right">
        <InputActor
          actorsList={actorsList}
          selectedActors={formData.actors}
          onActorChange={handleActorChange}
        />
        <InputText
          name="trailer"
          value={formData.trailer}
          onChange={handleChange}
          placeholder="Link Trailer"
        />
        <Select
          name="award"
          value={formData.award}
          onChange={handleChange}
          options={["Award 1", "Award 2", "Award 3"]}
        />
        <div className="form-group-submit">
          <BackButton onClick={() => console.log("Back button clicked")} /> {/* Menggunakan BackButton */}
          <SubmitButton onClick={() => console.log("Submit button clicked")} /> {/* Menggunakan SubmitButton */}
        </div>
      </div>
    </form>
  );
};

export default DramaInput;
