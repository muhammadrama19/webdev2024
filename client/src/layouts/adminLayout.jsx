import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import NavbarSidebar from '../components/navbarsidebar/navbarsidebar'; // Import NavbarSidebar
import Header from '../components/navbarsidebar/navbarsidebar';
import Sidebar from '../components/Sidebar/Sidebar';
import './adminLayout.scss'; // Import styles if you want additional layout styling
// import styles from './AdminLayout.scss'; // Import styles if you want additional layout styling

const AdminLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [userId, setUserId] = useState(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");
    const role = Cookies.get("role");

    if (token && user_id) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); 
        setIsLoggedIn(true);
        setUserId(user_id);

        if (role === 'Admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error); 
      }
    } else {
      console.log("Token or user_id not found"); 
    }
  }, []);

  return (
    <div className={`grid-container ${openSidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Header OpenSidebar={OpenSidebar} openSidebarToggle={openSidebarToggle} /> {/* Add NavbarSidebar */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} /> {/* Pass OpenSidebar */}
      <div className="main-container">
      
      <div>
        {isLoggedIn ? (
          isAdmin ? (
            <Outlet />  // Render main content for admin
          ) : (
            <div >
              <h2>Access Denied</h2>
              <p>You do not have the necessary permissions to view this page.</p>
            </div>
          )
        ) : (
          <div >
            <h2>Unauthorized Access</h2>
            <p>Please log in to access this page.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminLayout;
