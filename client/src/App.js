import logo from './logo.svg';
import './app.scss';
import Home from './home/home';
import Moviedetail from './detailmovie/detailmovie'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Register from './register/register';
import Login from './login/login';
import TestFetch from './test/testFetch';
import Detailmovie from './detailmovie/detailmovie';




function App() {
  return (

    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/detailmovie" element={<Moviedetail />} /> */}
        <Route path='/Register' element={<Register />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path= '/testFetch' element={<TestFetch/>}/>
        <Route path="/movies/:id" element={<Detailmovie />} />
        <Route path="/featured_movies/:id" element={<Moviedetail />} />
      </Routes>


    </Router>
    // <Moviedetail/>
    // <Home/>
  );
}

export default App;
