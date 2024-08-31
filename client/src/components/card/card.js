import React from 'react';
import './card.scss';

const card = ({ src, title, year, genres, rating, views }) => {
    return (
        <div className="card-item">
            <div className="image-container">
                <img src={src} alt="" />
            </div>
            <div className="content">
                <h3 className="title">{title}</h3>
                <p className="year">{year}</p>
                <p className="genres">{genres.join(', ')}</p>
                <div className="footer">
                    <span className="rating">Rate {rating}/5</span>
                    <span className="views">{views} views</span>
                </div>
            </div>
        </div>
    );
};

export default card;
