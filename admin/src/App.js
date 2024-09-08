import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from '../src/components/Header/Header';
import Sidebar from '../src/components/Sidebar/Sidebar';
import Home from '../src/Dashboard/Home';
import DramaInput from '../src/InputDrama/InputDrama';
import ListDrama from '../src/ListDrama/ListDrama';
import ValidateDrama from './ValidateDrama/ValidateDrama';
import ReviewManager from './ReviewManager/ReviewManager';
import ActorManager from './InputActor/InputActors';
import GenreManager from './InputGenres/InputGenres';
import CountryManager from './InputCountry/InputCountry';
import AwardsManager from './InputAward/InputAward';
import UserSetting from './UserSettings/UserSetting';

// Import component lain sesuai kebutuhan

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false); // Default tutup di mobile

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <div className={`grid-container ${openSidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header OpenSidebar={OpenSidebar} openSidebarToggle={openSidebarToggle} />
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} /> {/* Pass OpenSidebar */}
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie-input" element={<DramaInput />} />
            <Route path="/movie-list" element={<ListDrama />} />
            <Route path="/movie-validation" element={<ValidateDrama />} />
            <Route path="/review-list" element={<ReviewManager />} />
            <Route path="/attribute-actor" element={<ActorManager />} />
            <Route path="/attribute-genre" element={<GenreManager/>} />
            <Route path="/attribute-country" element={<CountryManager/>} />
            <Route path="/attribute-award" element={<AwardsManager  />} />
            <Route path="/users" element={<UserSetting  />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
