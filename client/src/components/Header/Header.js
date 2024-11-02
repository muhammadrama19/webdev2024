import React, { useState, useEffect } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsJustify,
} from "react-icons/bs";
import './Header.css';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Header({ OpenSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState(null); // Mulai dengan null
  const [email, setEmail] = useState(null); // Mulai dengan null
  const [role, setRole] = useState(null); // Mulai dengan null
  const navigate = useNavigate();

  // Fungsi untuk menangkap query parameter dari URL
  const getQueryParams = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const usernameFromCookies = Cookies.get("username");
    const emailFromCookies = Cookies.get("email");
    const roleFromCookies = Cookies.get("role");

    // Hanya set jika role adalah "admin"
    if (roleFromCookies === "Admin") {
      setUsername(usernameFromCookies);
      setEmail(emailFromCookies);
      setRole(roleFromCookies);
    }

    // Cek dari URL params jika login via Google
    const usernameFromGoogle = getQueryParams("username");
    const emailFromGoogle = getQueryParams("email");
  
    if (usernameFromGoogle && emailFromGoogle && roleFromCookies === "admin") {
      // Simpan data ke cookie jika role adalah admin
      Cookies.set("username", usernameFromGoogle, { expires: 1 });
      Cookies.set("email", emailFromGoogle, { expires: 1 });
  
      setUsername(usernameFromGoogle);
      setEmail(emailFromGoogle);
      setRole(roleFromCookies);

      // Clear query params after saving to cookies
      window.history.replaceState(null, null, window.location.pathname); 
    }
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-right">
        {/* Tambahkan onClick pada span user-name */}
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
              <h4>{username}</h4> {/* Menampilkan nama user */}
              <span className="profile-email">{email || "Unknown Email"}</span>
              <span className="profile-role">{role || "Guest Role"}</span>
            </div>
            <div className="profile-actions">
              <button className="btn-profile">Profile</button>
              <button className="btn-signout" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
