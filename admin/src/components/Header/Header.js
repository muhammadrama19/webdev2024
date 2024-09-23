import React, { useState } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsJustify,
} from "react-icons/bs";
import './Header.css';

function Header({ OpenSidebar, user }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
          {user?.name || "Guest"}
        </span>
        {showDropdown && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <img
                src="https://via.placeholder.com/100" // Ganti dengan URL gambar profil
                alt="profile"
                className="profile-image"
              />
              <h4>{user?.name || "Guest"}</h4> {/* Menampilkan nama user */}
              <span className="profile-id">{user?.id || "Unknown ID"}</span>
              <span className="profile-degree">D4-Teknik Informatika</span>
            </div>
            <div className="profile-actions">
              <button className="btn-profile">Profile</button>
              <button className="btn-signout">Sign out</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
