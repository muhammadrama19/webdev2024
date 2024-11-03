import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import NavbarSidebar from "../components/navbarsidebar/navbarsidebar";

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

  return (
    <div>
      {/* Only show NavbarSidebar if the user is an admin */}
      {isAdmin && (
        <NavbarSidebar
          openSidebarToggle={openSidebarToggle}
          toggleSidebar={OpenSidebar}
        />
      )}

      <div>
        {isLoggedIn ? (
          isAdmin ? (
            <Outlet /> // Render main content for admin
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
                textAlign: "center",
              }}
            >
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
            <h2>Unauthorized Access</h2>
            <p>Please log in to access this page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
