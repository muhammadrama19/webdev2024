import React from "react";
import "./detailmovie.scss";
// import MovieDetail from '../components/movieDetail/movieDetail';
import MovieDetail from "../components/moviecarddetail/movieCardDetail";
// import ActorCard from '../components/actorcard/actorCard';
import ActorSlider from "../components/actorSlider/actorSlider";

const detailmovie = () => {
  return (
    <div>
      <div className="movieDetail">
        <div className="movieDetailCard">
          <MovieDetail
            title="Another Title"
            rating="6.9"
            metaScore="N/A"
            description="Epic drama set thousands of years before the events of J.R.R. Tolkien's 'The Hobbit' and 'The Lord of the Rings'..."
            creators={["Patrick McKay", "John D. Payne"]}
            genres={["Action", "Adventure", "Drama"]}
            imageSrc="https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg"
          />
        </div>

        <div className="actorSlider">
          <ActorSlider />
        </div>
      </div>
    </div>
  );
};

export default detailmovie;
