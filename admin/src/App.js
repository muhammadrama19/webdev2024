import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "../src/components/Sidebar/Sidebar";
import Home from "../src/Dashboard/Home";
import InputDrama from "../src/InputDrama/InputDrama"; // Pastikan ini sudah sesuai dengan lokasi file InputDrama
import InputCountry from "../src/InputCountry/InputCountry"; // Pastikan ini sudah sesuai dengan lokasi file InputCountry
import InputAward from "../src/InputAward/InputAward"; // Pastikan ini sudah sesuai dengan lokasi file InputAward
import InputGenres from "../src/InputGenres/InputGenres"; // Pastikan ini sudah sesuai dengan lokasi file InputAward
import InputActors from "../src/InputActor/InputActors"; // Pastikan ini sudah sesuai dengan lokasi file InputActors
import ReviewManager from "../src/ReviewManager/ReviewManager"; // Pastikan ini sudah sesuai dengan lokasi file ReviewManager
import ListDrama from "./ListDrama/ListDrama";
import UserSetting from "./UserSettings/UserSetting";
// import { Nav } from "react-bootstrap";
import Navigation from "./components/NavBar/Nav";
import ValidateDrama from "./ValidateDrama/ValidateDrama";
import "./App.css";

function App() {
  const [toggle] = useState(true);

  // const Toggle = () => {
  //   setToggle(!toggle);
  // };

  return (
    <Router>
      <div className="container-fluid bg-secondary min-vh-100">
        <div className="row">
          {toggle && (
            <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
              <Sidebar />
            </div>
          )}
          {toggle && <div className="col-4 col-md-2"></div>}
          <div className="col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/drama-input" element={<InputDrama />} />
              <Route path="drama-list" element={<ListDrama/>} />
              <Route path="/drama-validasi" element={<ValidateDrama />} />
              <Route path="/country-input" element={<InputCountry />} />
              <Route path="/award-input" element={<InputAward />} />
              <Route path="/genre-input" element={<InputGenres />} />
              <Route path="/actor-input" element={<InputActors />} />
              <Route path="/review-manager" element={<ReviewManager />} />
              <Route path="user-settings" element={<UserSetting/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
