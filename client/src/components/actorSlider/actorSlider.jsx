import React, { useRef, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './actorSlider.scss';
import ActorCard from '../actorcard/actorCard';

const ActorSlider = ({ actors }) => {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);

  const listRef = useRef();

  const handleClick = (direction) => {
    const cardWidth = listRef.current.children[0].offsetWidth; // Get the width of one card
    const maxSlideNumber = Math.floor(listRef.current.scrollWidth / cardWidth) - Math.floor(window.innerWidth / cardWidth);

    setIsMoved(true);

    if (direction === 'left' && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${250 * (slideNumber - 1)}px)`;
    }

    if (direction === 'right' && slideNumber < maxSlideNumber) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-250 * (slideNumber + 1)}px)`;
    }
  };

  return (
    <Container fluid className='list'>
      <Row>
        <Col xs={12} className='listTitle'>Actors</Col>
      </Row>
      <Row className="wrapper">
        <Col xs={1} className="d-flex align-items-center justify-content-center">
          <ArrowBackIosIcon 
            className='sliderArrow back'
            onClick={() => handleClick("left")}
            style={{ display: !isMoved && "none" }} 
          />
        </Col>
        <Col xs={10}>
          <div ref={listRef} className="customContainer d-flex flex-nowrap">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                imageSrc={actor.actor_picture}
                name={actor.name}
                role={actor.role}
              />
            ))}
          </div>
        </Col>
        <Col xs={1} className="d-flex align-items-center justify-content-center">
          <ArrowForwardIosIcon 
            className='sliderArrow forward' 
            onClick={() => handleClick("right")} 
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ActorSlider;
