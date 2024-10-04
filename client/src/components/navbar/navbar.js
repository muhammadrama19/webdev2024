import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
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
  const [searchVisible, setSearchVisible] = useState(false); // State to control search visibility
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to control sidebar visibility

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Simulate fetching countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Replace this URL with your actual endpoint
        const response = await fetch("/api/countries");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
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

  // Close sidebar when screen size is larger than 960px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
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
          {/* Add onClick for redirecting to home on logo click */}
          <span className="logo-brand mt-2 me-3 mb-2" onClick={() => navigate("/")}>
            Lalajo Euy!
          </span>
          <div className="nav-links">
            {/* Add onClick for each navigation link */}
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/login")}>Login</span>
            <span onClick={() => navigate("/register")}>Register</span>
          </div>
        </div>
        <div className="right">
          <SearchBar />
          <MenuIcon className="hamburger" onClick={toggleSidebar} /> {/* Add this */}
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className={`sidebar ${sidebarVisible ? "active" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-brand" onClick={() => navigate("/")}>
            Lalajo Euy!
          </span>
          <CloseIcon className="close-icon" onClick={toggleSidebar} />
        </div>
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => navigate("/login")}>Login</span>
        <span onClick={() => navigate("/register")}>Register</span>
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
