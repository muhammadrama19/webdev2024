import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DramaInput from './components/DramaInput';
import { Navbar } from 'react-bootstrap';
// import Home from './components/Home';
// Import other components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path='/' element={<DramaInput />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
