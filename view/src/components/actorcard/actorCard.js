import React from 'react';
import { Card, Image } from 'react-bootstrap';
import './actorCard.scss';

const ActorCard = ({ imageSrc="https://avatar.iran.liara.run/public/38", name="No Name", role="No Role" }) => {

  const fallbackImage = "https://avatar.iran.liara.run/public/38";
  const actorImage = imageSrc === "N/A" ? fallbackImage : imageSrc; 

  return (
    <Card className="actor-card">
      <Image src={actorImage} alt={name || "No Name"} roundedCircle className="actor-image" />
      <Card.Body className="actor-info">
        <Card.Title as="h6">{name || "No Name" }</Card.Title>
        <Card.Text>{role || "No Role"}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ActorCard;
