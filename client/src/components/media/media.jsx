import './media.scss';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Media = ({ link }) => {
  // Function to extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; // Return the original URL if it's not a YouTube URL
  };

  const embedUrl = getYouTubeEmbedUrl(link);

  return (
    <Container>
      <Card className='mediaContainer'>
        <div className='mediaTitleSection'>
          Trailer
        </div>
        <Row>
          <Col xs={12} md={12}>
            <iframe 
              width="100%" 
              height="315" // Adjust height as needed
              src={embedUrl} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Media;
