import React, { useRef, useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./actorSlider.scss";
import ActorCard from "../actorcard/actorCard";

const ActorSlider = ({ actors }) => {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [maxSlideNumber, setMaxSlideNumber] = useState(0);

  const listRef = useRef();
  const containerRef = useRef();

  // Calculate the number of slides that can fit based on container and actor card width
  useEffect(() => {
    const handleResize = () => {
      if (listRef.current && containerRef.current) {
        const actorCardWidth =
          listRef.current.firstChild.getBoundingClientRect().width;
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        const visibleCards = Math.floor(containerWidth / actorCardWidth);
        setMaxSlideNumber(Math.ceil(actors.length - visibleCards)); // Total slides minus visible actors
      }
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize); // Recalculate on window resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup listener
  }, [actors.length]);

  const handleClick = (direction) => {
    const actorCardWidth =
      listRef.current.firstChild.getBoundingClientRect().width;
    const distance = actorCardWidth * 3; // Move by 3 cards width
    setIsMoved(true);

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${
        actorCardWidth * (slideNumber - 1) * -1
      }px)`;
    }

    if (direction === "right" && slideNumber < maxSlideNumber) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${
        actorCardWidth * (slideNumber + 1) * -1
      }px)`;
    }
  };

  return (
    <Container fluid className="list">
      <Row>
        <Col xs={12} className="listTitle">
          Actors
        </Col>
      </Row>
      <Row className="wrapper">
        <Col
          xs={1}
          className="d-flex align-items-center justify-content-center"
        >
          <ArrowBackIosIcon
            className="sliderArrow back"
            onClick={() => handleClick("left")}
            style={{ display: !isMoved && "none" }}
          />
        </Col>
        <Col xs={10} ref={containerRef}>
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
        <Col
          xs={1}
          className="d-flex align-items-center justify-content-center"
        >
          <ArrowForwardIosIcon
            className="sliderArrow forward"
            onClick={() => handleClick("right")}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ActorSlider;
