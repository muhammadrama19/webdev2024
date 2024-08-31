import React, { useRef, useState } from 'react';
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
        const distance = listRef.current.getBoundingClientRect().x - 50;

        setIsMoved(true);

        if (direction === 'left' && slideNumber > 0) {
            setSlideNumber(slideNumber - 1);
            listRef.current.style.transform = `translateX(${cardWidth * (slideNumber - 1)}px)`;
        }

        if (direction === 'right' && slideNumber < listRef.current.children.length - 1) {
            setSlideNumber(slideNumber + 1);
            listRef.current.style.transform = `translateX(${-cardWidth * (slideNumber + 1)}px)`;
        }
    };

    return (
        <div className='list'>
            <span className='listTitle'>Popular</span>
            <div className="wrapper">
                <ArrowBackIosIcon className='sliderArrow back'
                    onClick={() => handleClick("left")}
                    style={{ display: !isMoved && "none" }} />
                <div className="customContainer" ref={listRef}>
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
                </div>
                <ArrowForwardIosIcon className='sliderArrow forward' onClick={() => handleClick("right")} />
            </div>
        </div>
    );
};

export default ActorSlider;
