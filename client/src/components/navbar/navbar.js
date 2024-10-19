import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchInput/search";
import { BsPersonCircle } from "react-icons/bs"; 
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./navbar.scss";
import Cookies from 'js-cookie';


const Navbar = ({ loggedInUsername }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [countries, setCountries] = useState(["Indonesia", "Japan"]);
  const [selectedCountry, setSelectedCountry] = useState("Indonesia");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 
  const [username, setUsername] = useState(loggedInUsername || Cookies.get("username"));
  const [email, setEmail] = useState(Cookies.get("email"));
  const [role, setRole] = useState(Cookies.get("role"));



  const navigate = useNavigate();

  // Fungsi untuk menangkap query parameter dari URL
  const getQueryParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Menyimpan username dan email dari Google OAuth ke localStorage
  useEffect(() => {
    const usernameFromGoogle = getQueryParams("username");
    const emailFromGoogle = getQueryParams("email");
    const roleFromGoogle = getQueryParams("role");
  
    if (usernameFromGoogle && emailFromGoogle) {

      Cookies.set("username", usernameFromGoogle, { expires: 1 });
      Cookies.set("email", emailFromGoogle, { expires: 1 });
      Cookies.set("role", roleFromGoogle, { expires: 1 });
  
      setUsername(usernameFromGoogle);
      setEmail(emailFromGoogle);
      setRole(roleFromGoogle);  
      // Clear query params after saving to cookies
      window.history.replaceState(null, null, window.location.pathname); 
    }
  }, []);
  

  // Mengambil data negara dari API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); 
  };

  useEffect(() => {
    window.onscroll = () => {
      setIsScrolled(window.scrollY === 0 ? false : true);
      return () => (window.onscroll = null);
    };

  }, []);

  const handleLogout = () => {
    // Hapus data dari cookie
    Cookies.remove("username");
    Cookies.remove("email");
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("profilePicture");
  
    setUsername(null);
    setEmail(null);
    setRole(null);
  
    navigate("/login");
  };
  

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <span className="logo-brand mt-2 me-3 mb-2" onClick={() => navigate("/")}>
            Lalajo Euy!
          </span>
          <div className="nav-links">

            <span onClick={() => navigate("/")}>Home</span>
            {!username ? (
              <>
                <span onClick={() => navigate("/login")}>Login</span>
                <span onClick={() => navigate("/register")}>Register</span>
              </>
            ) : (
              <>
                <span>Welcome, {username}</span>
                <span onClick={handleLogout}>Logout</span>

              </>
            )}
          </div>
        </div>
        <div className="right">
          <SearchBar />

          <BsPersonCircle className="icon" onClick={toggleDropdown} />
          <span className="user-name" onClick={toggleDropdown}>
          {username || "Guest"}
        </span>
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <img
                  src="https://via.placeholder.com/100" 
                  alt="profile"
                  className="profile-image"
                />
                <h4>{username || "Guest"}</h4> 
                <span className="profile-email">{email || "Unknown ID"}</span>
                
              </div>
              <div className="profile-actions">
                <button className="btn-profile" onClick={() => navigate("/profile")}>Profile</button>
                <button className="btn-signout" onClick={handleLogout}>Sign out</button>
              </div>
            </div>
          )}

          <MenuIcon className="hamburger" onClick={toggleSidebar} />
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
        {!username ? (
          <>
            <span onClick={() => navigate("/login")}>Login</span>
            <span onClick={() => navigate("/register")}>Register</span>
          </>
        ) : (
          <>
            <span>Welcome, {username}</span>
            <span onClick={handleLogout}>Logout</span>
          </>

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
