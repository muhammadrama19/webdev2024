import './card.scss';

const Card = ({ src, title, year, genres, rating, views }) => {
  return (
    <div className="card-item">
      <div className="image-container">
        <img src={src} alt={title} />
      </div>
      <div className="content">
        <h3 className="title">{title}</h3>
        <p className="year">{year}</p>
        <p className="genres">{genres}</p> {/* Display genres as it comes (string) */}
        <div className="footer">
          <span className="rating">Rate {rating}/10</span>
          <span className="views">{views} views</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
