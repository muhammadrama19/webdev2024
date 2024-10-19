import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./profile.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
  const navigate = useNavigate();

  // Mengambil data pengguna yang sedang login dari backend
  useEffect(() => {
    axios
      .get("http://localhost:8001/profile", { withCredentials: true })
      .then((res) => {
        setUser(res.data); // Menyimpan data pengguna ke state
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        navigate("/login"); // Jika tidak ada data pengguna, arahkan ke halaman login
      });
  }, [navigate]);

  // Handle Edit Button Click
  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!user) {
    return <p>Loading...</p>; // Tampilkan loading saat data belum diterima
  }

  return (
    <div className="profile-page">
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Row className="profile-card">
          <Col className="text-center p-4">
            {/* Profile Picture */}
            <img
              src="/path-to-user-image.jpg" // Bisa diganti dengan data gambar pengguna jika tersedia
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div className="activity-section mb-3">
              <h2 className="mb-3">{user.username}</h2>{" "}
              {/* Tampilkan nama pengguna */}
              {/* User Info */}
              <p>
                <strong>Email:</strong> {user.email}
              </p>{" "}
              {/* Tampilkan email */}
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.joined).toLocaleDateString()}
              </p>{" "}
              {/* Tampilkan tanggal bergabung */}
              <p>
                <strong>Favorite Genre:</strong> {user.favoriteGenre}
              </p>{" "}
              {/* Tampilkan genre favorit */}
            </div>

            {/* Edit Profile Button */}
            <Button variant="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
