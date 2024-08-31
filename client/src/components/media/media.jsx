import './media.scss'
import { Container, Card, Row, Col } from 'react-bootstrap';



const Media = () => {
  return (
    <Container>
    <Card className='mediaContainer'>
      <div className='mediaTitleSection'>
        Trailer
      </div>
      <Row>
        <Col xs={12} md={12}>
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/GTNMt84KT0k?si=1mfHTpov-XrD8g3F" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </Col>
      </Row>
    </Card>
  </Container>
  )
}

export default Media
