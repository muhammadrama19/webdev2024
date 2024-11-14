// List.js
import React from 'react';
import Slider from 'react-slick';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItem from '../listitem/listitem';
import './list.scss';

// Custom Arrow Components
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="sliderArrow forward" onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="sliderArrow back" onClick={onClick}>
      <ArrowBackIosIcon />
    </div>
  );
};

const List = ({ title, movies }) => {
  const settings = {
    dots: false,
    infinite: false,
    centerFading: '20px',
    speed: 500,
    slidesToShow: 4, // Adjust number of slides visible
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="lists">
      <div className="wrapperList">
        <Slider {...settings}>
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <ListItem
                key={index}
                imageUrl={movie.background}
                rating={movie.imdb_score}
                title={movie.title}
                description={movie.synopsis}
              />
            ))
          ) : (
            <p>No movies available</p>
          )}
        </Slider>
      </div>
    </div>
  );
};

export default List;
