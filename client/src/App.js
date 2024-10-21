<<<<<<< HEAD
=======
import { useState } from "react";
import { createContext } from "react";
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
import './app.scss';
import Home from './home/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Register from './register/register';
import Login from './login/login';
<<<<<<< HEAD
import TestFetch from './test/testFetch';
import Detailmovie from './detailmovie/detailmovie';
import SearchResult from './search/searchResult';
import ForgotPassword from './forgotPassword/forgotPassword';
import { SearchProvider } from './context/searchContext'; // Import SearchProvider

function App() {
  return (
    <SearchProvider>
      <Router>
=======
import OTPInput from "./login/OTPInput";
import TestFetch from './test/testFetch';
import Detailmovie from './detailmovie/detailmovie';
import SearchResult from './search/searchResult';
import ForgotPassword from "./login/forgotPassowrd";
import ResetPassword from "./login/reset";

import Profile from './profile/profile';

import { SearchProvider } from './context/searchContext'; // Import SearchProvider
export const RecoveryContext = createContext();

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState();
  const [otp, setOTP] = useState();

  return (
    <SearchProvider>
      <RecoveryContext.Provider value={{ page, setPage, otp, setOTP, setEmail, email }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/testFetch" element={<TestFetch />} />
            <Route path="/movies/:id" element={<Detailmovie />} />
            <Route path="/searchresult" element={<SearchResult />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

          </Routes>
        </Router>
      </RecoveryContext.Provider>
      {/* <Router>
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/testFetch" element={<TestFetch />} />
          <Route path="/movies/:id" element={<Detailmovie />} />
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<<<<<<< HEAD

          
        </Routes>
      </Router>
=======
          <Route path="/dashboard" element={<Dashboard />} />

          
        </Routes>
      </Router> */}
>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
    </SearchProvider>
  );
}

<<<<<<< HEAD
=======

>>>>>>> 1782fe1ea812b9325200dd2923b485ccbb8ae7b2
export default App;
