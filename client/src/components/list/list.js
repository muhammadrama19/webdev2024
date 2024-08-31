import React, { useRef, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './list.scss';
import ListItem from '../listitem/listitem';

const List = () => {  // Rename 'list' to 'List'

    const [isMoved, setIsMoved] = useState(false);

    const [slideNumber, setSlideNumber] = useState(0);


  const listRef = useRef();

  const handleClick = (direction) => {
    
    let distance = listRef.current.getBoundingClientRect().x - 50;
    setIsMoved(true);
    if (direction === 'left' && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }
    if(direction === 'right' && slideNumber < 5) {
        setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  }

  return (
    <div className='lists'>
      <span className='listsTitle'>Popular</span>
      <div className="wrapperList">
        <ArrowBackIosIcon className='sliderArrow back' 
        onClick={() => handleClick("left")}
        style={{display: !isMoved && "none"}} />
        <div className="customContainerList" ref={listRef}>
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
          <ListItem />
        </div>
        <ArrowForwardIosIcon className='sliderArrow forward' onClick={() => handleClick("right")} />
      </div>
    </div>
  );
}

export default List;  // Update the export to 'List'
