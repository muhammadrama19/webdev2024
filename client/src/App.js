import './app.scss';
import Home from './home/home';
import Moviedetail from './detailmovie/detailmovie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Register from './register/register';
import Login from './login/login';
import TestFetch from './test/testFetch';
import Detailmovie from './detailmovie/detailmovie';
import SearchResult from './search/searchResult';
import { SearchProvider } from './context/searchContext'; // Import SearchProvider
import SignIn from './components/auth/signIn';
import SignUp from './components/auth/signUp';

function App() {
  return (
    <SearchProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/testFetch" element={<TestFetch />} />
          <Route path="/movies/:id" element={<Detailmovie />} />
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />

          
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
