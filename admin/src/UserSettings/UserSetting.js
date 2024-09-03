import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEnvelope, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../UserSettings/UserSetting.css"; // Pastikan Anda memiliki file CSS ini

const UserSetting = () => {
  const users = [
    { id: 1, username: "anita1", email: "anita@gmail.com" },
    { id: 2, username: "borang", email: "bora@yahoo.com" },
    // Tambahkan pengguna lainnya di sini
  ];

  return (
    <div className="user-setting-container">
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" className="d-flex align-items-center">
          <FaPlus className="me-2" />
          Tambah Akun
        </Button>
      </div>
      <Table striped bordered hover className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="table-danger">
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="link" className="action-button">
                  <FaEnvelope /> Send first email
                </Button>
                <Button variant="link" className="action-button">
                  <FaEdit /> Edit
                </Button>
                <Button variant="link" className="action-button text-danger">
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserSetting;
