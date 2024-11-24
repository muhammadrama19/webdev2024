// ListItem.js
import React from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './listitem.scss';

const ListItem = ({ 
  imageUrl = 'https://via.placeholder.com/150', 
  title = 'No Title', 
  rating = 'N/A', 
  description = 'No Description Available' 
}) => {
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