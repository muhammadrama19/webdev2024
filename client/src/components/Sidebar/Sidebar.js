import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import {
  BsHeadsetVr,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillFolderFill,
  BsBook,
  BsPeopleFill,
  BsArrowLeftRight,
  BsFillGearFill,
  BsJustify,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation untuk memeriksa rute saat ini

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation(); // Mengambil rute saat ini
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isAttributesOpen, setIsAttributesOpen] = useState(false); // State untuk Attributes accordion

  // Toggle untuk membuka/menutup accordion Movies
  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };

  // Toggle untuk membuka/menutup accordion Attributes
  const toggleAttributesMenu = () => {
    setIsAttributesOpen(!isAttributesOpen);
  };

  // Menggunakan useEffect untuk memeriksa rute dan mengatur state dari accordion
  useEffect(() => {
    if (location.pathname.includes("/movie")) {
      setIsMoviesOpen(true); // Buka accordion jika berada di rute Movie
    } else {
      setIsMoviesOpen(false); // Tutup accordion jika tidak di rute Movie
    }

    if (location.pathname.includes("/attribute")) {
      setIsAttributesOpen(true); // Buka accordion jika berada di rute Attributes
    } else {
      setIsAttributesOpen(false); // Tutup accordion jika tidak di rute Attributes
    }
  }, [location.pathname]); // Meng-update setiap kali rute berubah

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-open" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsHeadsetVr className="icon_header" /> LALAJO EUY
        </div>
        <div className="close-sidebar">
          <BsJustify className="close-icon" onClick={OpenSidebar} />
        </div>
      </div>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
            <BsGrid1X2Fill className="icon" /> <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Movies Accordion */}
        <li className="sidebar-list-item">
          <div className="sidebar-link" onClick={toggleMoviesMenu}>
            <BsFillArchiveFill className="icon" /> <span>Movies</span>
            {isMoviesOpen ? (
              <BsChevronUp className="accordion-icon" />
            ) : (
              <BsChevronDown className="accordion-icon" />
            )}
          </div>
          <ul className={`submenu-list ${isMoviesOpen ? "open" : "closed"}`}>
            <li className="submenu-list-item">
              <NavLink
                to="/movie-list"
                className="submenu-link"
                activeClassName="active"
              >
                Movie List
              </NavLink>
            </li>
            <li className="submenu-list-item">
              <NavLink
                to="/validate-drama"
                className="submenu-link"
                activeClassName="active"
              >
                Movie Validation
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Attributes Accordion */}
        <li className="sidebar-list-item">
          <div className="sidebar-link" onClick={toggleAttributesMenu}>
            <BsFillFolderFill className="icon" /> <span>Attributes</span>
            {isAttributesOpen ? (
              <BsChevronUp className="accordion-icon" />
            ) : (
              <BsChevronDown className="accordion-icon" />
            )}
          </div>
          <ul
            className={`submenu-list ${isAttributesOpen ? "open" : "closed"}`}
          >
            <li className="submenu-list-item">
              <NavLink
                to="/manage-actor"
                className="submenu-link"
                activeClassName="active"
              >
                Input Actor
              </NavLink>
            </li>
            <li className="submenu-list-item">
              <NavLink
                to="/manage-genre"
                className="submenu-link"
                activeClassName="active"
              >
                Input Genre
              </NavLink>
            </li>
            <li className="submenu-list-item">
              <NavLink
                to="/manage-country"
                className="submenu-link"
                activeClassName="active"
              >
                Input Country
              </NavLink>
            </li>
            <li className="submenu-list-item">
              <NavLink
                to="/manage-awards"
                className="submenu-link"
                activeClassName="active"
              >
                Input Award
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="sidebar-list-item">
          <NavLink
            to="/manage-review"
            className="sidebar-link"
            activeClassName="active"
          >
            <BsBook className="icon" /> <span>Reviews</span>
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="/users"
            className="sidebar-link"
            activeClassName="active"
          >
            <BsPeopleFill className="icon" /> <span>Users</span>
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink
            to="/settings"
            className="sidebar-link"
            activeClassName="active"
          >
            <BsFillGearFill className="icon" /> <span>Settings</span>
          </NavLink>
        </li>
        <br />
        <li className="sidebar-list-item">
          <span
            onClick={() => {
              const newTab = window.open("http://localhost:3001/", "clientTab");
              if (newTab) {
                newTab.focus(); // Memfokuskan ke tab jika sudah terbuka
              }
            }}
            className="sidebar-link"
            style={{ cursor: "pointer" }} 
          >
            <BsArrowLeftRight className="icon" /> <span>Switch to Client</span>
          </span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
