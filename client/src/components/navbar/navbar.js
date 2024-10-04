import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../searchInput/search";
import { BsPersonCircle } from "react-icons/bs"; // pastikan kamu install react-icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./navbar.scss";

const Navbar = ({ loggedInUsername }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [countries, setCountries] = useState(["Indonesia", "Japan"]);
  const [selectedCountry, setSelectedCountry] = useState("Indonesia");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Untuk toggle dropdown profil
  const [username, setUsername] = useState(loggedInUsername || localStorage.getItem("username"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUsername) {
      setUsername(loggedInUsername);
    }
  }, [loggedInUsername]);

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
    setShowDropdown(!showDropdown); // Toggle dropdown saat ikon diklik
  };

  // Event scroll untuk mengubah navbar jika halaman di-scroll
  useEffect(() => {
    window.onscroll = () => {
      setIsScrolled(window.scrollY === 0 ? false : true);
      return () => (window.onscroll = null);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
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
                  src="https://via.placeholder.com/100" // Ganti dengan URL gambar profil
                  alt="profile"
                  className="profile-image"
                />
                <h4>{username || "Guest"}</h4> {/* Menampilkan nama user */}
                <span className="profile-email">{email || "Unknown ID"}</span>
                <span className="profile-role">{role || "Guest Role"}</span>
              </div>
              <div className="profile-actions">
                <button className="btn-profile">Profile</button>
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
