import '../styles/dramaInput.css';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <div className='logo'>
            <h1>
                <Link to="/dashboard">DRAMAKU</Link>
            </h1>
        </div>
    )
}

export default Logo;
