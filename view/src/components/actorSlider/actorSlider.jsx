import React from 'react';
import Slider from 'react-slick';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ActorCard from '../actorcard/actorCard'; // Import ActorCard component
import './actorSlider.scss';

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

const List = ({ title, actors=[] }) => {
  const settings = {
  dots: false,
  infinite: false,
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
    {title && <h2>{title}</h2>} {/* Render title only if provided */}
    <div className="wrapperList">
    <Slider {...settings}>
      {actors && actors.length > 0 ? (
      actors.map((actor, index) => (
        <ActorCard
        key={index}
        imageSrc={actor.actor_picture} // Assuming actor object contains image property
        name={actor.name || 'No Name'} // Default to 'No Name' if name is missing
        role={actor.role || 'No Role'} // Assuming actor object contains role property
        />
      ))
      ) : (
      <p>No actors available</p>
      )}
    </Slider>
    </div>
  </div>
  );
};

export default List;
