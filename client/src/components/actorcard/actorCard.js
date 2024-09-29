import React from 'react';
import { Card, Image } from 'react-bootstrap';
import './actorCard.scss';

const ActorCard = ({ imageSrc, name, role }) => {
  return (
    <Card className="actor-card">
      <Image src={imageSrc} alt={name} roundedCircle className="actor-image" />
      <Card.Body className="actor-info">
        <Card.Title as="h6">{name}</Card.Title>
        <Card.Text>{role}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ActorCard;
