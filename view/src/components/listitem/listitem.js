// ListItem.js
import React from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './listitem.scss';

const ListItem = ({ imageUrl, title,rating, description }) => {
  return (
    <div className="listItem">
      <img src={imageUrl} alt={title} className="listItemImage" />
      <div className="overlay">
        <span className="genreBadge">{rating}</span>
        <MoreVertIcon className="moreIcon" />
        <div className="info">
          <h3 className="title">{title}</h3>
          <p className="description">{description}</p>
          <PlayCircleOutlineIcon className="playIcon" />
        </div>
      </div>
    </div>
  );
};

export default ListItem;
