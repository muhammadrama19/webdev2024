import {Navbar, Nav, Container} from 'react-bootstrap';
import '../styles/nav.css';

const Navigationbar = () => {
    return (
        <Navbar bg='dark'>
            <Container>
                <Navbar.Brand href='/'>Lalajo Euy</Navbar.Brand>
                <Nav>
                    <Nav.Link href='/'>Home</Nav.Link>
                    <Nav.Link href='/about'>About</Nav.Link>
                    <Nav.Link href='/contact'>Contact</Nav.Link>
                    <Nav.Link href='/login'>Login</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Navigationbar