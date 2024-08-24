import logo from './logo.svg';
import { Container, Row, Col } from 'react-bootstrap';
import Navigationbar from './components/Navigationbar';
import "./styles/home.css"

function App() {
  return (

    <div className='background'>
      <div className='myBg'>
        <Navigationbar />
        <div className='intro border mt-2 d-flex justify-content-center align-item-center'>
        <Container className='d-flex justify-content-center align-item-center border'>
          <Row>
            <Col> <h1>Halo by</h1></Col>
          </Row>
        </Container>
        </div>

      </div>
    </div>
    
  );
}

export default App;
