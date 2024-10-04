import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../searchInput/search";
import "./navbar.scss";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [countries, setCountries] = useState(["Indonesia", "Japan"]); // Fallback data
  const [selectedCountry, setSelectedCountry] = useState("Indonesia");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState(null); // State to hold user info

  useEffect(() => {
    // Retrieve the email from local storage when the component mounts
    const email = localStorage.getItem('email');
    if (email) {
      setUser(email); // Set the user state to the retrieved email
    }
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <span className="logo-brand mt-2 me-3 mb-2">Lalajo Euy!</span>
          <div className="nav-links">
            <span>Home</span>
            {user ? ( // Display email if user is logged in
              <span>{user}</span>
            ) : (
              <>
                <span>Login</span>
                <span>Register</span>
              </>
            )}
          </div>
        </div>
        <div className="right">
          <SearchBar />
          <MenuIcon className="hamburger" onClick={toggleSidebar} />
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-brand">Lalajo Euy!</span>
          <CloseIcon className="close-icon" onClick={toggleSidebar} />
        </div>
        <span>Home</span>
        {!user ? ( // Show Login/Register in sidebar if not logged in
          <>
            <span>Login</span>
            <span>Register</span>
          </>
        ) : (
          <span>{user}</span> // Show email in sidebar if logged in
        )}
        <div className="country">
          <div className="options">
            {countries.map((country, index) => (
              <span key={index} onClick={() => handleCountryChange(country)}>
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
