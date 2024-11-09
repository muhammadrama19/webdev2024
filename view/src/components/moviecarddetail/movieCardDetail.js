import { Card, Row, Col, Badge } from 'react-bootstrap';
import './movieCardDetail.scss'; // Assuming you want to customize the styling

const MovieCardDetail = ({ title, rating, country, description, creators, genres, imageSrc, availability, status }) => {
  return (
    <Card className="movie-card-detail">
      <Row>
        <Col xs={12} md={4} lg={3} className="text-center">
          <Card.Img variant="top" src={imageSrc} className="movie-image" />
        </Col>
        <Col xs={12} md={8} lg={9}>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text as="div">
              <div className="mb-2 text-white">{genres.join(", ")} | {new Date().getFullYear()}</div>
              <div className="rating-section mb-3">
                <span className="rating">
                  <Badge pill bg="warning" text="dark">
                  Rate: {rating}
                  </Badge> 
                </span>
                <br/>
                <span className="rating">
                  <Badge pill bg="warning" text="dark">
                  Available on : {availability}
                  </Badge> 
                </span>
                <br/>

              </div>
              <span className="metascore">
                  <Badge bg="secondary">Country Release: {country || "N/A"}</Badge>
                </span>
                <br />
                <span className="metascore pt-5">
                  <Badge bg="secondary">Status: {status || "N/A"}</Badge>
                </span>
                <br />
                
              <div className="description mb-3 mt-3">{description}</div>
              <div className="creators mb-3">
                <strong>Creator:</strong> {creators.join(", ")}
              </div>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default MovieCardDetail;
