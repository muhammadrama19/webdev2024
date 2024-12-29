
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../components/navbarsidebar/navbarsidebar';
import Sidebar from '../components/Sidebar/Sidebar';
import './adminLayout.scss';

const AdminLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const user_id = Cookies.get("user_id");
    const role = Cookies.get("role");

    if (token && user_id) {
      try {

        const decoded = JSON.parse(atob(token.split(".")[1]));
        setIsLoggedIn(true);
        setUserId(user_id);

        if (role === "Admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("Token or user_id not found");
    }
  }, []);

  // Check if current route is /movie-input
  const isMovieInputRoute = location.pathname === "/movie-input";

  return (
    <div className={`grid-container ${openSidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}>

      {/* Display Header and Sidebar only if the user is an admin */}
      {isAdmin && (
        <>
          <Header OpenSidebar={OpenSidebar} openSidebarToggle={openSidebarToggle} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        </>
      )}

      <div className="main-container">
        {isLoggedIn ? (
          isAdmin || isMovieInputRoute ? ( // Allow access if admin or accessing /movie-input
            <Outlet />
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}>
              <h2>Access Denied</h2>
              <p>
                You do not have the necessary permissions to view this page.
              </p>
            </div>
          )
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <h2>Unauthorized Access</h2>
                <p>Please log in to access this page.</p>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
