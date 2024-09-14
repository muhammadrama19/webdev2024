import React, { useState, useRef } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItem from '../listitem/listitem';
import './list.scss';

const List = ({ title, movies }) => {  // Receive movies as a prop
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const listRef = useRef();

  const handleClick = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 50;
    setIsMoved(true);
    if (direction === 'left' && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${ 5 *230 + distance}px)`;
    }
    if (direction === 'right' && slideNumber < movies.length - 1) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${ 5 * (-230) + distance}px)`;
    }
    if ( slideNumber == movies.length - 1) {
      setSlideNumber(0);
      listRef.current.style.transform = `translateX(${0}px)`;
    }
  };

  return (
    <div className="lists">
      <span className="listsTitle">{title}</span>  {/* Display the title */}
      <div className="wrapperList">
        <ArrowBackIosIcon
          className="sliderArrow back"
          onClick={() => handleClick('left')}
          style={{ display: !isMoved && 'none' }}
        />
        <div className="customContainerList" ref={listRef}>
          {movies.map((movie, index) => (
            <ListItem
              key={index}
              imageUrl={movie.background}
              rating={movie.imdb_score}
              title= {movie.title}  // Adjust if views are available
            />
          ))}
        </div>
        <ArrowForwardIosIcon className="sliderArrow forward" onClick={() => handleClick('right')} />
      </div>
    </div>
  );
};

export default List;
