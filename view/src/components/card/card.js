import './card.scss';

const Card = ({
  onClick,
  src,
  title,
  year,
  genres,
  rating,
  views,
}) => {
  return (
    <div className="card-item" onClick={onClick}>
      <div className="image-container">
        <img src={src || 'https://via.placeholder.com/196x294?text=No+Image+Available'} loading="lazy" alt={title || 'No Title'} />
      </div>
      <div className="content">
        <h3 className="title">{title || 'No Title Available'}</h3>
        <p className="year">{year || 'Unknown Year'}</p>
        <p className="genres">{genres || 'Unknown Genres'}</p> {/* Ensure fallback */}
        <div className="footer">
          <span className="rating">Rate {rating || 'N/A'}/5</span>
          <span className="views">{views || 0} views</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
