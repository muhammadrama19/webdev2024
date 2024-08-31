import React from 'react';
import './actorCard.scss'; // Import the custom SCSS file

const ActorCard = ({ imageSrc, name, role }) => {
  return (
    <div className="actor-card">
      <img src={imageSrc} alt={name} className="actor-image" />
      <div className="actor-info">
        <h6>{name}</h6>
        <p>{role}</p>
      </div>
    </div>
  );
};

export default ActorCard;
