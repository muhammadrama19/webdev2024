import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItem from '../listitem/listitem';
import './list.scss';

const List = ({ title, movies }) => {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [maxSlideNumber, setMaxSlideNumber] = useState(0);

  const listRef = useRef();
  const containerRef = useRef();

  // Calculate the number of visible items per slide
  useEffect(() => {
    const handleResize = () => {
      if (listRef.current && listRef.current.firstChild && containerRef.current) {
        const listItemWidth = listRef.current.firstChild.getBoundingClientRect().width;
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        const visibleItems = Math.floor(containerWidth / listItemWidth);

        // Set max slide number based on total items and visible items
        setMaxSlideNumber(movies.length - visibleItems); // This ensures the last item is fully visible
      }
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize); // Recalculate on window resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup listener
  }, [movies.length]);

  const handleClick = (direction) => {
    if (!listRef.current || !listRef.current.firstChild) return; // Safety check

    const listItemWidth = listRef.current.firstChild.getBoundingClientRect().width;
    setIsMoved(true);

    if (direction === 'left' && slideNumber > 0) {
      // Move left
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${listItemWidth * (slideNumber - 1) * -1}px)`;
    }

    if (direction === 'right' && slideNumber < maxSlideNumber) {
      // Move right but stop sliding when the last item is fully visible
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${listItemWidth * (slideNumber + 1) * -1}px)`;
    }
  };

  return (
    <div className="lists">
      <span className="listsTitle">{title}</span>
      <div className="wrapperList">
        <ArrowBackIosIcon
          className="sliderArrow back"
          onClick={() => handleClick('left')}
          style={{ display: !isMoved && 'none' }}
        />
        <div className="customContainerList" ref={containerRef}>
          <div className="listItemsContainer" ref={listRef}>
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <ListItem
                  key={index}
                  imageUrl={movie.background}
                  rating={movie.imdb_score}
                  title={movie.title}
                />
              ))
            ) : (
              <p>No movies available</p>
            )}
          </div>
        </div>
        <ArrowForwardIosIcon className="sliderArrow forward" onClick={() => handleClick('right')} />
      </div>
    </div>
  );
};

export default List;
