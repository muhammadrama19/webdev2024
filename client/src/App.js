import './app.scss';
import Home from './home/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Register from './register/register';
import Login from './login/login';
import Dashboard from './dashboard/Home';
import TestFetch from './test/testFetch';
import Detailmovie from './detailmovie/detailmovie';
import SearchResult from './search/searchResult';
import ForgotPassword from "./login/forgotPassowrd";
import ResetPassword from "./login/Reset";
import Profile from './profile/profile';


import { SearchProvider } from './context/searchContext'; // Import SearchProvider

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
