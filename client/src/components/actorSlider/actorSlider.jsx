import React, { useRef, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './actorSlider.scss';
import ActorCard from '../actorcard/actorCard';

const ActorSlider = () => {

    const [isMoved, setIsMoved] = useState(false);
    const [slideNumber, setSlideNumber] = useState(0);

    const listRef = useRef();

    const handleClick = (direction) => {
        const cardWidth = listRef.current.children[0].offsetWidth; // Get the width of one card
        const maxSlideNumber = Math.floor(listRef.current.scrollWidth / cardWidth) - Math.floor(window.innerWidth / cardWidth);

        setIsMoved(true);

        if (direction === 'left' && slideNumber > 0) {
            setSlideNumber(slideNumber - 1);
            listRef.current.style.transform = `translateX(${cardWidth * (slideNumber - 1)}px)`;
        }

        if (direction === 'right' && slideNumber < maxSlideNumber) {
            setSlideNumber(slideNumber + 1);
            listRef.current.style.transform = `translateX(${-cardWidth * (slideNumber + 1)}px)`;
        }
    };

    return (
        <Container fluid className='list'>
        <Row>
            <Col xs={12} className='listTitle'>Actor</Col>
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
                    <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                           <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                                        <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                                        <ActorCard
                        imageSrc="https://images.plex.tv/photo?size=medium-240&scale=2&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fb%2Fpeople%2Fb0f317384df7d4ca98f934dd455a76c9.jpg"
                        name="Richard Eden"
                        role="Alex Murphy / RoboCop"
                    />
                    
                    {/* Add more ActorCard components */}
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
